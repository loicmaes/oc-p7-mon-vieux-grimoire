const mongoose = require('mongoose');
const validators = require('../validators');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required!'],
    unique: [true, 'Email address is unique! Please try something else.'],
    validate: {
      validator: validators.isEmail,
      message: _ => 'Please enter a valid email address!'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
  }
})

const User = mongoose.model('User', schema);
module.exports = User;
