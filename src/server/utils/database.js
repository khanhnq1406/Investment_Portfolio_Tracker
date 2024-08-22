const { MONGODB_URI } = require("./constants");
const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDatabase;
