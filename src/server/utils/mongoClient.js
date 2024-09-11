const { MONGODB_URI, COLLECTION } = require("./constants");

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(MONGODB_URI);
(async () => await client.connect())();
const db = client.db("investment-db");
const userCollection = db.collection(COLLECTION.USER);
const transactionCollection = db.collection(COLLECTION.TRANSACTION);
const holdingCollection = db.collection(COLLECTION.HOLDING);

const cleanup = (event) => {
  console.log("Cleaning up MongoDB connection");
  // SIGINT is sent for example when you Ctrl+C a running process from the command line.
  client.close(); // Close MongodDB Connection when Process ends
  process.exit(); // Exit with default success-code '0'.
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
module.exports = {
  db,
  userCollection,
  transactionCollection,
  holdingCollection,
};
