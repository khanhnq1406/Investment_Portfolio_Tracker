const { Server } = require("socket.io");
const axios = require("axios");
const {
  userCollection,
  holdingCollection,
  transactionCollection,
} = require("../utils/mongoClient");
const { CRYPTO_PRICE_URL, SOCKET } = require("../utils/constants");

function socketio(server) {
  const io = new Server(server, {
    cors: {
      origin: SOCKET,
      transports: ["websocket", "polling"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on("fetchData", async (data) => {
      const email = data.email;
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
      const responseData = {
        totalInvested: user.totalInvested,
        currentBalance: totalBalance,
        holdingList: holdingList,
        holdingTable: holdingTable,
      };
      io.to(socket.id).emit("fetchDataResponse", responseData);
    });

    socket.on("getPrice", async (data) => {
      const currency = data.currency;
      const response = await axios.get(`${CRYPTO_PRICE_URL}${currency}USDT`);
      const price = response.data.price;
      io.to(socket.id).emit("getPriceResponse", price);
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
}

module.exports = socketio;
