const express = require("express");
const authController = require("../controller/authController");

const router = express.Router();
const authValidator = require("../validators/authValidator");

router.post("/logIn", authValidator.logInValidator, authController.logIn);

router.post("/signUp", authValidator.signUpValidator, authController.signUp);

router.post("/signUp-google", authController.googleAuth);

router.post("/verify-2FA", authValidator.verify2FA, authController.verify2FA);

router.post(
  "/resend-2FA",
  authValidator.resend2FA,
  authController.resend2FACode
);

module.exports = router;
