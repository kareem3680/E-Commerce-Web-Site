const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleWare = require("../middleWares/validatorMiddleware");
const asyncHandler = require("express-async-handler");
const categoryController = require("../controller/categoryController");
const categoryModel = require("../models/categoryModel");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleWare,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters")
    .custom((value, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(value);
      }
      return true;
    }),
  validatorMiddleWare,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleWare,
];

exports.updateCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Category Id Format")
    .custom(
      asyncHandler(async (id, { req }) => {
        const documentId = req.params.id;
        const exists = await categoryModel.findById(id);
        if (!exists) {
          return Promise.reject({
            message: `No document For This Id: ${documentId}`,
            statusCode: 404,
          });
        }
        return true;
      })
    ),
  check("name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .optional()
    .custom((value, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(value);
      }
      return true;
    }),
  validatorMiddleWare,
];
