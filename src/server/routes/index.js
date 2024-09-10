const authRouter = require("./auth");
const testRouter = require("./test");
const transactionRouter = require("./transaction");
function route(app) {
  app.use("/auth", authRouter);
  app.use("/test", testRouter);
  app.use("/transaction", transactionRouter);
}
module.exports = route;
