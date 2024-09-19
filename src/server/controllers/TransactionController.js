const {
  userCollection,
  holdingCollection,
  transactionCollection,
} = require("../utils/mongoClient");
const { STATUS_CODE } = require("../utils/constants");
const { hexEncode } = require("../utils/hexConvertor");
class TransactionController {
  // [GET] /transaction/addTransaction
  async addTransaction(req, res) {
    const { email, coinName, total, quantity, price, datetime, type } =
      req.body;
    try {
      const id = hexEncode(`${coinName}:${email}`).trim();
      const coinHolding = await holdingCollection.findOne({ _id: id });
      if (coinHolding === null) {
        if (type === "Sell") {
          return res
            .status(STATUS_CODE.BAD_REQUEST)
            .json({ message: "Cannot sell coins that you don't own" });
        }
        await holdingCollection.insertOne({
          _id: id,
          name: coinName,
          holdingQuantity: Number(quantity),
          totalCost: Number(total),
          avgPrice: Number(price),
        });

        const filter = { email: email };
        const updateDoc = {
          $inc: {
            totalInvested: Number(total),
          },
          $push: {
            CoinHolding: id,
          },
        };
        await userCollection.updateOne(filter, updateDoc);

        await transactionCollection.insertOne({
          coinHoldingId: id,
          transactions: [
            {
              type: type,
              price: Number(price),
              cost: Number(total),
              datetime: datetime,
              quantity: quantity,
            },
          ],
        });
      } else {
        const holdingQuantityUpdate =
          type === "Buy"
            ? Number(coinHolding.holdingQuantity) + Number(quantity)
            : Number(coinHolding.holdingQuantity) - Number(quantity);
        const totalCostUpdate =
          type === "Buy"
            ? Number(coinHolding.totalCost) + Number(total)
            : Number(coinHolding.totalCost) - Number(total);
        const avgPriceUpdate =
          type === "Buy"
            ? Number(totalCostUpdate) / Number(holdingQuantityUpdate)
            : Number(coinHolding.avgPrice);
        let filter = { _id: id };
        let updateDoc = {
          $set: {
            holdingQuantity: holdingQuantityUpdate,
            totalCost: totalCostUpdate,
            avgPrice: avgPriceUpdate,
          },
        };
        await holdingCollection.updateOne(filter, updateDoc);

        filter = { email: email };
        updateDoc = {
          $inc: {
            totalInvested: type === "Buy " ? Number(total) : -Number(total),
          },
        };
        await userCollection.updateOne(filter, updateDoc);

        filter = { coinHoldingId: id };
        updateDoc = {
          $push: {
            transactions: {
              type: type,
              price: Number(price),
              cost: Number(total),
              datetime: datetime,
              quantity: Number(quantity),
            },
          },
        };
        await transactionCollection.updateOne(filter, updateDoc);
      }
      return res
        .status(STATUS_CODE.CREATED)
        .json({ message: "Transaction successful" });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  // [GET] /transaction/table
  async table(req, res) {
    const email = req.query.email;
    const symbol = req.query.symbol;
    const row = Number(req.query.row);
    const page = Number(req.query.page);
    const limit = row * page;
    const id = hexEncode(`${symbol}:${email}`).trim();

    const transactions = await transactionCollection
      .aggregate([
        {
          $match: { coinHoldingId: id },
        },
        {
          $project: {
            _id: null,
            transactions: {
              $reverseArray: { $slice: ["$transactions", limit - row, limit] },
            },
          },
        },
      ])
      .toArray();
    res.json(transactions[0]);
  }

  // [GET] /transaction/numberOfPage
  async numberOfPage(req, res) {
    const email = req.query.email;
    const symbol = req.query.symbol;
    const id = hexEncode(`${symbol}:${email}`).trim();
    const counter = await transactionCollection
      .aggregate([
        {
          $match: { coinHoldingId: id },
        },
        {
          $project: { _id: null, counter: { $size: "$transactions" } },
        },
      ])
      .toArray();
    res.json(counter[0].counter);
  }
}

module.exports = new TransactionController();
