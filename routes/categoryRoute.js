const express = require("express");
const categoryController = require("../controller/categoryController");
const authController = require("../controller/authController");

const router = express.Router();
const categoryValidator = require("../validators/categoryValidator");

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    categoryValidator.createCategoryValidator,
    categoryController.createCategory
  );

router
  .route("/:id")
  .get(
    categoryValidator.getCategoryValidator,
    categoryController.getSpecificCategory
  )
  .put(
    authController.protect,
    authController.allowedTo("admin"),
    categoryValidator.updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory
  );

module.exports = router;
