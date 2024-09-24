const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/TransactionController");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/addTransaction",
  verifyToken,
  transactionController.addTransaction
);
router.post("/delete", verifyToken, transactionController.delete);

router.get("/table", verifyToken, transactionController.table);
router.get("/numberOfPage", verifyToken, transactionController.numberOfPage);

module.exports = router;
