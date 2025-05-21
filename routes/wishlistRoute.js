const express = require("express");
const wishlistController = require("../controller/wishlistController");

const router = express.Router();
const wishlistValidator = require("../validators/wishlistValidator");
const authController = require("../controller/authController");

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("customer"),
    wishlistController.getAllWishlists
  )
  .post(
    authController.protect,
    authController.allowedTo("customer"),
    wishlistValidator.addProductToWishlistValidator,
    wishlistController.addProductToWishlist
  );

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.allowedTo("customer"),
    wishlistValidator.removeProductFromWishlistValidator,
    wishlistController.removeProductFromWishlist
  );

module.exports = router;
