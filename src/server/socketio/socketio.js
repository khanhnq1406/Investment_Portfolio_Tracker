const { Server } = require("socket.io");
function socketio(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on("getPrice", (data) => {
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
}

module.exports = socketio;
