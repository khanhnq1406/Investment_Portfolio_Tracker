const mongoose = require("mongoose");
const connectDatabase = require("../utils/database");

connectDatabase();
const UserSchema = mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  fullname: { type: String, require: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
