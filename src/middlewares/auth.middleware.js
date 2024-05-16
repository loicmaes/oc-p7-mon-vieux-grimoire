const { authenticate } = require('../functions/auth.function');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) return res.status(403).json("You're not allowed to do that!");
  const token = req.headers.authorization.split(' ')[1];

  try {
    const userId = await authenticate(token);
    req.userId = userId;
    next();
  } catch (e) {
    return res.status(403).json("You're not allowed to do that!");
  }
}
