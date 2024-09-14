const { Server } = require("socket.io");
const axios = require("axios");
const {
  userCollection,
  holdingCollection,
  transactionCollection,
} = require("../utils/mongoClient");
const { CRYPTO_PRICE_URL } = require("../utils/constants");

function socketio(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on("getPrice", async (data) => {
      console.log(data);
      const email = data.email;
      const user = await userCollection.findOne({ email: email });
      let totalBalance = 0;
      let holdingList = [];
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
        const holdingQuantity = holding[0].holdingQuantity;
        const currentBalance = price * holdingQuantity;
        totalBalance += currentBalance;
      }
      const responseData = {
        totalInvested: user.totalInvested,
        currentBalance: totalBalance,
        holdingList: holdingList,
      };
      socket.emit("getPriceResponse", responseData);
      console.log(responseData);
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
}

module.exports = socketio;
