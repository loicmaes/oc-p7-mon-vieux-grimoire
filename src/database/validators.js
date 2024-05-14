function isEmail (value) {
  return /^[\w-.]+@([\w-.]\.)[\w-]{2,}$/.test(value);
}
function isStrongPassword (value) {
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value);
}

module.exports = {
  isEmail,
  isStrongPassword,
}
