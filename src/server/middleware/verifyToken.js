const { STATUS_CODE } = require("../utils/constants");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Access token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.email = decoded.email;
    next();
  } catch (error) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: "Invalid token" });
  }
};
module.exports = verifyToken;
