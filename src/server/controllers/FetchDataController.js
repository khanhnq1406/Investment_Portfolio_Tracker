const axios = require("axios");
const {
  userCollection,
  holdingCollection,
  transactionCollection,
} = require("../utils/mongoClient");
const { STATUS_CODE, CRYPTO_PRICE_URL } = require("../utils/constants");
const { hexEncode } = require("../utils/hexConvertor");

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

  // [GET] /fetch/details
  async details(req, res) {
    const email = req.query.email;
    const symbol = req.query.symbol;
    const id = hexEncode(`${symbol}:${email}`).trim();
    const holding = await holdingCollection.findOne({
      _id: id,
    });
    if (holding !== null) {
      const request = await axios.get(`${CRYPTO_PRICE_URL}${symbol}USDT`);
      const price = request.data.price;
      const holdingValue = parseFloat(
        (Number(price) * Number(holding.holdingQuantity)).toFixed(2)
      );
      const profit = parseFloat(
        (Number(holdingValue) - Number(holding.totalCost)).toFixed(2)
      );
      const response = {
        holdingValue: holdingValue,
        holdingQuantity: parseFloat(Number(holding.holdingQuantity).toFixed(8)),
        totalCost: holding.totalCost,
        avgCost: holding.avgPrice,
        profit: profit,
      };
      return res.status(STATUS_CODE.OK).json(response);
    }
    return res.status(STATUS_CODE.OK).json(null);
  }
}
module.exports = new FetchDataController();
