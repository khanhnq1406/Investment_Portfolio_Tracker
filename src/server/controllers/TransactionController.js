const db = require("../utils/mongoClient");
const { COLLECTION } = require("../utils/constants");
const { ObjectId } = require("mongodb");
const hexEncode = require("../utils/hexEncode");
class TransactionController {
  // [GET] /controller/addTransaction
  async addTransaction(req, res) {
    const { email, coinName, total, quantity, price, datetime, type } =
      req.body;
    console.log(email, coinName, total, quantity, price, datetime, type);
    console.log(COLLECTION);

    // const id = hexEncode(`${coinName}`).trim();
    // const oid = new ObjectId(id);
    // console.log(`oid: ${oid}`);

    // const coinHolding = await db
    //   .collection(COLLECTION.HOLDING)
    //   .find({ _id: new ObjectId(id) });
    // console.log(coinHolding);
    res.send("Done");
  }
}

module.exports = new TransactionController();
