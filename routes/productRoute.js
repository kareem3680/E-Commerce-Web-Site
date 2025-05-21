const express = require("express");
const productController = require("../controller/productController");

const router = express.Router();
const productValidator = require("../validators/productValidator");
const authController = require("../controller/authController");
const reviewRoute = require("./reviewRoute");

router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(productController.getProducts)
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    productValidator.createProductValidator,
    productController.createProduct
  );

router
  .route("/:id")
  .get(
    productValidator.getProductValidator,
    productController.getSpecificProduct
  )
  .put(
    authController.protect,
    authController.allowedTo("admin"),
    productValidator.updateProductValidator,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    productValidator.deleteProductValidator,
    productController.deleteProduct
  );

module.exports = router;
