const { check } = require("express-validator");
const validatorMiddleWare = require("../middleWares/validatorMiddleware");
const reviewModel = require("../models/reviewModel");
const productModel = require("../models/productModel");
const asyncHandler = require("express-async-handler");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review Id Format"),
  validatorMiddleWare,
];

exports.getAllReviewsValidator = [
  check("productId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Product Id Format")
    .custom(
      asyncHandler(async (id, { req }) => {
        const productExists = await productModel.findById(
          req.filterObject.product
        );
        if (!productExists) {
          return Promise.reject({
            message: `No document For This Id: ${req.filterObject.product}`,
            statusCode: 404,
          });
        }
        return true;
      })
    ),
  validatorMiddleWare,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),
  check("user").isMongoId().withMessage("Invalid user Id Format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product Id Format")
    .custom(async (val, { req }) => {
      const review = await reviewModel.findOne({
        user: req.user.id,
        product: req.body.product,
      });
      if (review) {
        return Promise.reject({
          message: `You are already reviewed to this product`,
          statusCode: 404,
        });
      }
    }),
  validatorMiddleWare,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review Id Format")
    .custom(async (val, { req }) => {
      if (req.user.role == "user") {
        const review = await reviewModel.findById(val);
        if (!review) {
          return Promise.reject({
            message: `Review not found`,
            statusCode: 404,
          });
        }
        if (review.user._id.toString() !== req.user.id) {
          return Promise.reject({
            message: `Unauthorized to delete this review`,
            statusCode: 401,
          });
        }
      }
    }),
  validatorMiddleWare,
];

exports.updateReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),
  check("id")
    .isMongoId()
    .withMessage("Invalid review Id Format")
    .custom(async (val, { req }) => {
      const review = await reviewModel.findById(val);
      if (!review) {
        return Promise.reject({
          message: `Review not found`,
          statusCode: 404,
        });
      }
      if (review.user._id.toString() !== req.user.id) {
        return Promise.reject({
          message: `Unauthorized to update this review`,
          statusCode: 401,
        });
      }
    }),
  validatorMiddleWare,
];
