const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect("mongodb://host.docker.internal/investment-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDatabase;
