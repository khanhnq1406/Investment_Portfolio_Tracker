const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const route = require("./routes");

const connectDatabase = require("./utils/database");
const socketio = require("./socketio/socketio");
const http = require("http");
connectDatabase();

app.use(cors());
app.use(express.json());

//use midleware to get data
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Define routes and middleware
route(app);

// Socket IO
const server = http.createServer(app);
socketio(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
