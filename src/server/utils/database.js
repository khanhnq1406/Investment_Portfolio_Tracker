const { DOCKER_HOST } = require("./constants");
const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(`mongodb://${DOCKER_HOST}/investment-db`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDatabase;
