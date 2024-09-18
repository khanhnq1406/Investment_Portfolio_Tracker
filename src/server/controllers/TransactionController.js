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
          page: 1,
          count: 1,
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
        const transaction = await transactionCollection.findOne(filter);
        if (Number(transaction.count) < 10) {
          updateDoc = {
            $set: {
              page: transaction.page,
              count: Number(transaction.count) + 1,
            },
            $push: {
              transactions: {
                type: type,
                price: Number(price),
                cost: Number(total),
                datetime: datetime,
                quantity: quantity,
              },
            },
          };
          await transactionCollection.updateOne(filter, updateDoc);
        } else {
          await transactionCollection.insertOne({
            coinHoldingId: id,
            page: Number(transaction.page) + 1,
            count: 1,
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
        }
      }
      return res
        .status(STATUS_CODE.CREATED)
        .json({ message: "Transaction successful" });
    } catch (error) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  // [GET] /transaction/table
  async table(req, res) {
    const email = req.query.email;
    const symbol = req.query.symbol;
    const fromPage = req.query.fromPage;
    const toPage = req.query.toPage;
    console.log(fromPage, toPage, email, symbol);
    const id = hexEncode(`${symbol}:${email}`).trim();

    const holding = await transactionCollection
      .find({
        coinHoldingId: id,
        page: { $gt: Number(fromPage), $lte: Number(toPage) },
      })
      .toArray();
    res.json(holding);
  }

  // [GET] /transaction/numberOfPage
  async numberOfPage(req, res) {
    const email = req.query.email;
    const symbol = req.query.symbol;
    const id = hexEncode(`${symbol}:${email}`).trim();
    const numberOfPage = await transactionCollection.count({
      coinHoldingId: id,
    });
    res.json(numberOfPage);
  }
}

module.exports = new TransactionController();
