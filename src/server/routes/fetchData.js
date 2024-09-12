const express = require("express");
const router = express.Router();
const fetchDataController = require("../controllers/FetchDataController");
const verifyToken = require("../middleware/verifyToken");

router.get("/summary", verifyToken, fetchDataController.summary);

module.exports = router;
