const {
  userCollection,
  holdingCollection,
  transactionCollection,
} = require("../utils/mongoClient");
const { STATUS_CODE } = require("../utils/constants");
const { hexEncode } = require("../utils/hexConvertor");
const { BSON, EJSON, ObjectId } = require("bson");

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
          type: type,
          price: Number(price),
          cost: Number(total),
          datetime: datetime,
          quantity: Number(quantity),
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

        updateDoc = {
          coinHoldingId: id,
          type: type,
          price: Number(price),
          cost: Number(total),
          datetime: datetime,
          quantity: Number(quantity),
        };

        await transactionCollection.insertOne(updateDoc);
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
      .find({ coinHoldingId: id })
      .sort({ _id: -1 })
      .skip(limit - row)
      .limit(limit)
      .toArray();
    res.json(transactions);
  }

  // [GET] /transaction/numberOfPage
  async numberOfPage(req, res) {
    const email = req.query.email;
    const symbol = req.query.symbol;
    const id = hexEncode(`${symbol}:${email}`).trim();
    const counter = await transactionCollection.count({ coinHoldingId: id });
    res.json(counter);
  }

  // [POST] /transaction/deleteTransaction
  async delete(req, res) {
    const { id, cost, price, quantity, symbol } = req.body;
    const email = req.email;

    console.log(id, cost, price, quantity, symbol);
    const coinHoldingId = hexEncode(`${symbol}:${email}`).trim();
    const coinHolding = await holdingCollection.findOne({ _id: coinHoldingId });
    if (coinHolding !== null) {
      const holdingQuantityUpdate =
        Number(coinHolding.holdingQuantity) - Number(quantity);
      const totalCostUpdate = Number(coinHolding.totalCost) - Number(cost);
      const avgPriceUpdate =
        Number(totalCostUpdate) / Number(holdingQuantityUpdate);

      let filter = { _id: coinHoldingId };

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
          totalInvested: -Number(cost),
        },
      };
      await userCollection.updateOne(filter, updateDoc);
      console.log("Updated");
    }
    console.log(id);
    const objectId = new ObjectId(id);
    const isDeleted = await transactionCollection.deleteOne({
      _id: objectId,
    });
    if (isDeleted.deletedCount) {
      return res
        .status(STATUS_CODE.OK)
        .json({ message: "Transaction deleted" });
    } else {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "Cannot delete transaction" });
    }
  }
}

module.exports = new TransactionController();
