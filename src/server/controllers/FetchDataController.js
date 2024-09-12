const {
  userCollection,
  holdingCollection,
  transactionCollection,
} = require("../utils/mongoClient");
const { STATUS_CODE } = require("../utils/constants");

class FetchDataController {
  summary(req, res) {
    const email = req.email;
    console.log(email);
    res.send("OK");
  }
}
module.exports = new FetchDataController();
