const express = require("express");
const addressController = require("../controller/addressController");

const router = express.Router();
const authController = require("../controller/authController");
const addressValidator = require("../validators/addressValidator");

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("customer"),
    addressController.getAllAddresses
  )
  .post(
    authController.protect,
    authController.allowedTo("customer"),
    addressValidator.addAddressValidator,
    addressController.addAddress
  );

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.allowedTo("customer"),
    addressValidator.removeAddressValidator,
    addressController.removeAddress
  );

module.exports = router;
