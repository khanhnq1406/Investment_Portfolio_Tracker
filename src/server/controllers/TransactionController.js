const {
  collectionTransaction,
  userCollection,
  holdingCollection,
  transactionCollection,
} = require("../utils/mongoClient");
const { COLLECTION, STATUS_CODE } = require("../utils/constants");
const { hexEncode } = require("../utils/hexConvertor");
class TransactionController {
  // [GET] /controller/addTransaction
  async addTransaction(req, res) {
    const { email, coinName, total, quantity, price, datetime, type } =
      req.body;
    try {
      const id = hexEncode(`${coinName}:${email}`).trim();
      const coinHolding = await holdingCollection.findOne({ _id: id });
      if (coinHolding === null) {
        await holdingCollection.insertOne({
          _id: id,
          holdingQuantity: Number(quantity),
          totalCost: Number(total),
          avgPrice: Number(price),
        });

        const user = await userCollection.findOne({ email: email });
        const filter = { email: email };
        const updateDoc = {
          $set: {
            totalInvested: Number(user.totalInvested) + Number(total),
            CoinHolding: [...user.CoinHolding, id],
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

        const user = await userCollection.findOne({ email: email });
        filter = { email: email };
        updateDoc = {
          $set: {
            totalInvested: Number(user.totalInvested) + Number(total),
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
              },
            ],
          });
        }
      }
      return res.status(200).json({ message: "Transaction successful" });
    } catch (error) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
}

module.exports = new TransactionController();
