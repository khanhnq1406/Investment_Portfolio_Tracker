const axios = require("axios");
const {
  userCollection,
  holdingCollection,
  transactionCollection,
} = require("../utils/mongoClient");
const { STATUS_CODE, CRYPTO_PRICE_URL } = require("../utils/constants");

class FetchDataController {
  // [GET] /fetchData/summary
  async summary(req, res) {
    const email = req.email;
    const user = await userCollection.findOne({ email: email });
    let totalBalance = 0;
    let holdingList = [];
    let holdingTable = [];
    for (let i = 0; i < user.CoinHolding.length; i++) {
      const holding = await holdingCollection
        .find({
          _id: user.CoinHolding[i],
        })
        .toArray();
      const currency = holding[0].name;
      const totalCost = holding[0].totalCost;
      holdingList.push({ [`${currency}`]: totalCost });
      const response = await axios.get(`${CRYPTO_PRICE_URL}${currency}USDT`);
      const price = response.data.price;
      holdingTable.push({ ...holding[0], price: price });
      const holdingQuantity = holding[0].holdingQuantity;
      const currentBalance = price * holdingQuantity;
      totalBalance += currentBalance;
    }
    res.status(STATUS_CODE.OK).json({
      totalInvested: user.totalInvested,
      currentBalance: totalBalance,
      holdingList: holdingList,
      holdingTable: holdingTable,
    });
  }
}
module.exports = new FetchDataController();
