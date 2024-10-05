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
router.post("/edit", verifyToken, transactionController.edit);

router.get("/table", verifyToken, transactionController.table);
router.get("/numberOfPage", verifyToken, transactionController.numberOfPage);

router.patch(
  "/editTotalInvested",
  verifyToken,
  transactionController.editTotalInvested
);
router.patch(
  "/editCoinHolding",
  verifyToken,
  transactionController.editCoinHolding
);
module.exports = router;
