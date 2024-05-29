const { hash, compare } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const User = require('../database/models/user.model');
const {isStrongPassword} = require("../database/validators");

const TOKEN_DURATION = process.env.TOKEN_VALIDITY_DURATION ?? '1h';

async function login (res, email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({message: 'User not found!'});
    if (!await compare(password, user.password)) return res.status(401).json({message: 'Invalid credentials!'});
    return res.json({
      userId: user._id,
      token: await sign({
        userId: user._id
      }, process.env.PRIVATE_ENCRYPTION_KEY, { expiresIn: TOKEN_DURATION }),
    })
  } catch (e) {
    return res.status(500).json({
      message: 'Something went wrong!',
      error: e,
    })
  }
}
async function register (res, email, password) {
  if (!isStrongPassword(password)) return res.status(400).json('Your password is too weak!');

  const h = await hash(password, 10);

  try {
    const { _id } = await User.create({
      email,
      password: h,
    });
    const token = await sign({
      userId: _id
    }, process.env.PRIVATE_ENCRYPTION_KEY, { expiresIn: TOKEN_DURATION });

    return res.status(201).json({
      message: 'Votre compte a bien été créé !',
      userId: _id,
      token,
    });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json('Email already in use!');
    return res.status(500).json({
      message: 'Something went wrong!',
      error: e,
    })
  }
}
async function authenticate (token) {
  try {
    const decoded = await verify(token, process.env.PRIVATE_ENCRYPTION_KEY);
    return decoded.userId;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  login,
  register,
  authenticate,
}
