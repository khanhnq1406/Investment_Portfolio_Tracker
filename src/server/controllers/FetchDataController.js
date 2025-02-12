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
    const holdingIds = user.CoinHolding;
    const holdings = await Promise.all(
      holdingIds.map((id) => holdingCollection.findOne({ _id: id }))
    );
    const priceRequests = holdings.map((holding) =>
      axios.get(`${CRYPTO_PRICE_URL}${holding.name}USDT`)
    );
    const priceResponses = await Promise.all(priceRequests);

    let totalBalance = 0;
    const holdingList = [];
    const holdingTable = [];

    holdings.forEach((holding, index) => {
      const currency = holding.name;
      const totalCost = holding.totalCost;
      holdingList.push({ [currency]: totalCost });

      const price = priceResponses[index].data.price;
      holdingTable.push({ ...holding, price });

      const holdingQuantity = holding.holdingQuantity;
      totalBalance += price * holdingQuantity;
    });

    const sortedHoldingList = holdingList.sort((a, b) => {
      const valueA = Object.values(a)[0]; // Get the value of the first (and only) property in the object
      const valueB = Object.values(b)[0]; // Same for the second object
      return valueB - valueA; // Sort in descending order
    });
    const sortedHoldingTable = holdingTable.sort((a, b) => {
      const valueA = Number(a.totalCost); // Get the value of the first (and only) property in the object
      const valueB = Number(b.totalCost); // Same for the second object
      return valueB - valueA; // Sort in descending order
    });
    res.status(STATUS_CODE.OK).json({
      totalInvested: user.totalInvested,
      currentBalance: totalBalance,
      holdingList: sortedHoldingList,
      holdingTable: sortedHoldingTable,
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
