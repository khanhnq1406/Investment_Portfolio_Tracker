const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, authController.index);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/resendOtp", authController.resendOtp);
router.post("/verifyOtp", authController.verifyOtp);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resendRecoveryOtp", authController.resendRecoveryOtp);
router.post("/verifyRecoveryOtp", authController.verifyRecoveryOtp);
router.post("/createNewPassword", authController.createNewPassword);


module.exports = router;
