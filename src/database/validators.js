function isEmail (value) {
  return /^[\w-.]+@([\w-.]+\.)[\w-]{2,}$/.test(value);
}
function isStrongPassword (value) {
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(value);
}
function minmax(value, min, max, strict = false) {
  return strict ? min < value && value < max : min <= value && value <= max;
}

module.exports = {
  isEmail,
  isStrongPassword,
  minmax,
}
