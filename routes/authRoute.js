const express = require("express");
const authController = require("../controller/authController");

const router = express.Router();
const authValidator = require("../validators/authValidator");

router.post("/logIn", authValidator.logInValidator, authController.logIn);

router.post("/signUp", authValidator.signUpValidator, authController.signUp);

router.post("/verify-2FA", authValidator.verify2FA, authController.verify2FA);

module.exports = router;
