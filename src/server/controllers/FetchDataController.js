const axios = require("axios");
const {
  userCollection,
  holdingCollection,
  transactionCollection,
} = require("../utils/mongoClient");
const { STATUS_CODE, CRYPTO_PRICE_URL } = require("../utils/constants");

class FetchDataController {
  async summary(req, res) {
    const email = req.email;
    const user = await userCollection.findOne({ email: email });
    let totalBalance = 0;
    for (let i = 0; i < user.CoinHolding.length; i++) {
      const holding = await holdingCollection
        .find({
          _id: user.CoinHolding[i],
        })
        .toArray();
      const currency = holding[0].name;
      const response = await axios.get(`${CRYPTO_PRICE_URL}${currency}USDT`);
      const price = response.data.price;
      const holdingQuantity = holding[0].holdingQuantity;
      const currentBalance = price * holdingQuantity;
      totalBalance += currentBalance;
    }
    res.status(STATUS_CODE.OK).json({
      totalInvested: user.totalInvested,
      currentBalance: totalBalance,
    });
  }
}
module.exports = new FetchDataController();
