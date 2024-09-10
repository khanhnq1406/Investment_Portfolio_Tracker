const { MONGODB_URI } = require("./constants");

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(MONGODB_URI);
(async () => await client.connect())();
const db = client.db("investment-db");
const cleanup = (event) => {
  console.log("Cleaning up MongoDB connection");
  // SIGINT is sent for example when you Ctrl+C a running process from the command line.
  client.close(); // Close MongodDB Connection when Process ends
  process.exit(); // Exit with default success-code '0'.
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
module.exports = db;
