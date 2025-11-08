const jwt = require("jsonwebtoken");

// ✅ Create Token
const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
   process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// ✅ Verify Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  createToken,
  verifyToken,
};
