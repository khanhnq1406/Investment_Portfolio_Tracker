const express = require("express");
const router = express.Router();
const fetchDataController = require("../controllers/FetchDataController");
const verifyToken = require("../middleware/verifyToken");

router.get("/summary", verifyToken, fetchDataController.summary);
router.get("/details", verifyToken, fetchDataController.details);

module.exports = router;
