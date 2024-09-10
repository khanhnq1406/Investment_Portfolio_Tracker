const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/TransactionController");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/addTransaction",
  verifyToken,
  transactionController.addTransaction
);

module.exports = router;
