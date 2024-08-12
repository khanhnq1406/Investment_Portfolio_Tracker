const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/resendOtp", authController.resendOtp);
router.post("/verifyOtp", authController.verifyOtp);

router.post("/deleteUser", authController.deleteUser);
router.get("/getAllUser", authController.getAllUser);
router.get("/redisTesting", authController.redisTesting);
router.get("/getAllData", authController.getAllData);

module.exports = router;
