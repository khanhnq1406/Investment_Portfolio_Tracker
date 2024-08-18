const express = require("express");
const router = express.Router();
const testController = require("../controllers/TestController");
const verifyToken = require("../middleware/verifyToken");

router.post("/deleteUser", testController.deleteUser);
router.get("/getAllUser", testController.getAllUser);
router.get("/redisTesting", testController.redisTesting);
router.get("/getAllData", verifyToken, testController.getAllData);

module.exports = router;
