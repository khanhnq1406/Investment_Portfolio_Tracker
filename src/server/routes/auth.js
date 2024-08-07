const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

router.post("/register", authController.register);
router.post("/deleteUser", authController.deleteUser);
router.get("/getAllUser", authController.getAllUser);
router.get("/redisTesting", authController.redisTesting);

module.exports = router;
