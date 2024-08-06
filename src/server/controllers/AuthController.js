const User = require("../models/User");
const { STATUS_CODE } = require("../utils/constants");
class AuthController {
  // [POST] /register
  async register(req, res, next) {
    const { name, email, password } = req.body;
    const hasEmail = await User.findOne({ email: email });
    try {
      if (hasEmail === null) {
        const user = new User({ name, email, password });
        await user.save();
        return res
          .status(STATUS_CODE.CREATED)
          .json({ message: "User successfully created" });
      } else {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: "Email already exists" });
      }
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while creating the user" });
    }
  }

  async deleteUser(req, res, next) {
    const { email } = req.body;
    try {
      const deletedUser = await User.findOneAndDelete({ email: email });
      if (!deletedUser) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "User not found" });
      }
      return res
        .status(STATUS_CODE.OK)
        .json({ message: "User successfully deleted" });
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while deleting the user" });
    }
  }

  async getAllUser(req, res, next) {
    try {
      const users = await User.find();
      res.status(STATUS_CODE.OK).json(users);
    } catch (error) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while fetching users" });
    }
  }
}

module.exports = new AuthController();
