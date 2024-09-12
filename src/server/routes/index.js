const authRouter = require("./auth");
const testRouter = require("./test");
const transactionRouter = require("./transaction");
const fetchDataRouter = require("./fetchData");
function route(app) {
  app.use("/auth", authRouter);
  app.use("/test", testRouter);
  app.use("/transaction", transactionRouter);
  app.use("/fetch", fetchDataRouter);
}
module.exports = route;
