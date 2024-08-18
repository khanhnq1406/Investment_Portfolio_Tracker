const authRouter = require("./auth");
const testRouter = require("./test");

function route(app) {
  app.use("/auth", authRouter);
  app.use("/test", testRouter);
}
module.exports = route;
