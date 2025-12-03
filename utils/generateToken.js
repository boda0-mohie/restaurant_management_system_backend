const jwt = require('jsonwebtoken');

const generatedToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};


module.exports = {
  generatedToken
}