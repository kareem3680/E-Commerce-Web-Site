const express = require("express");

const router = express.Router();

const cartController = require("../controller/cartController");
const cartValidator = require("../validators/cartValidator");
const authController = require("../controller/authController");

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("customer"),
    cartController.getAllProductsInCart
  )
  .post(
    authController.protect,
    authController.allowedTo("customer"),
    cartValidator.addProductToCartValidator,
    cartController.addProductToCart
  )
  .delete(
    authController.protect,
    authController.allowedTo("customer"),
    cartController.clearCart
  );

router
  .route("/applyCoupon")
  .put(
    authController.protect,
    authController.allowedTo("customer"),
    cartValidator.applyCouponToCartValidator,
    cartController.applyCouponToCart
  );

router
  .route("/:id")
  .put(
    authController.protect,
    authController.allowedTo("customer"),
    cartValidator.updateProductQuantityInCartValidator,
    cartController.updateProductQuantityInCart
  )
  .delete(
    authController.protect,
    authController.allowedTo("customer"),
    cartValidator.removeProductFromCartValidator,
    cartController.removeProductFromCart
  );
module.exports = router;
