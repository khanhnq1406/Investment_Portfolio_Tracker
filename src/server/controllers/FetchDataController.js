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
    try {
      const email = req.email;
      const user = await userCollection.findOne({ email });
      const holdingIds = user.CoinHolding;
      
      // Load all holdings in parallel
      const holdings = await Promise.all(
        holdingIds.map((id) => holdingCollection.findOne({ _id: id }))
      );
      
      // Fetch all Binance prices once
      const { data: allPrices } = await axios.get(
        "https://www.binance.com/api/v3/ticker/price"
      );
      
      // Build lookup map { symbol: price }
      const priceMap = Object.fromEntries(
        allPrices.map((p) => [p.symbol, parseFloat(p.price)])
      );
      
      let totalBalance = 0;
      const holdingList = [];
      const holdingTable = [];

      for (let index = 0; index < holdings.length; index++) {
        const holding = holdings[index];
        const id = hexEncode(`${holding.name}:${email}`).trim();
      
        const transactions = await transactionCollection
          .find({ coinHoldingId: id })
          .toArray();
      
        let totalInvested = 0;
        let remainingCostBasis = 0;
        let remainingQty = 0;
        let realizedPNL = 0;
        let sold = 0;
      
        for (const tx of transactions) {
          if (tx.type === "Buy") {
            totalInvested += tx.quantity * tx.price;
            remainingCostBasis += tx.quantity * tx.price;
            remainingQty += tx.quantity;
          }
          if (tx.type === "Sell") {
            const proceeds = tx.quantity * tx.price;
            sold += proceeds;
            remainingQty -= tx.quantity;
            if (proceeds <= remainingCostBasis) {
              remainingCostBasis -= proceeds;
            } else {
              const realizedProfit = proceeds - remainingCostBasis;
              realizedPNL += realizedProfit;
              remainingCostBasis = 0;
            }
          }
        }
      
        // Get price from bulk map
        const symbol = `${holding.name}USDT`;
        const price = priceMap[symbol] ?? 0;
      
        const holdingValue = price * holding.holdingQuantity;
        const avgCost = remainingQty > 0 ? remainingCostBasis / remainingQty : 0;
        const unrealizedPNL = remainingQty * (price - avgCost);
        const totalPNL = realizedPNL + unrealizedPNL;
        const totalPNLPercent =
          totalInvested > 0 ? (totalPNL / totalInvested) * 100 : 0;
        // const realizedPNLPercent =
        //   totalInvested > 0 ? (realizedPNL / totalInvested) * 100 : 0;
        // const unrealizedPNLPercent =
        //   remainingCostBasis > 0 ? (unrealizedPNL / remainingCostBasis) * 100 : 0;
      
        const currency = holding.name;
        const totalCost = holding.totalCost;

        holdingTable.push({
          ...holding,
          price: Number(price.toFixed(2)),
          totalPNLPercent: Number(totalPNLPercent.toFixed(2)),
          avgCost: Number(avgCost.toFixed(2)),
          totalPNL: Number(totalPNL.toFixed(2)),
          totalInvested: Number(totalInvested.toFixed(2)),
          remainingCostBasis: Number(remainingCostBasis.toFixed(2)),
          sold: Number(sold.toFixed(2)),
          unrealizedPNL: Number(unrealizedPNL.toFixed(2)),
          realizedPNL: Number(realizedPNL.toFixed(2)),
          // realizedPNLPercent: Number(realizedPNLPercent.toFixed(2)),
          // unrealizedPNLPercent: Number(unrealizedPNLPercent.toFixed(2)),
          holdingValue: Number(holdingValue.toFixed(2)),
        });
        holdingList.push({ [currency]: holdingValue });
      
        totalBalance += price * holding.holdingQuantity;
      }
      
      const sortedHoldingList = holdingList.sort((a, b) => {
        const valueA = Object.values(a)[0];
        const valueB = Object.values(b)[0];
        return valueB - valueA;
      });
      const sortedHoldingTable = holdingTable.sort(
        (a, b) => b.holdingValue - a.holdingValue
      );

      res.status(STATUS_CODE.OK).json({
        totalInvested: user.totalInvested,
        currentBalance: totalBalance,
        holdingList: sortedHoldingList,
        holdingTable: sortedHoldingTable,
      });
    } catch (error) {
      console.error("FetchDataController.Summary error:", error);
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred while fetch summary data" });
    }
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
