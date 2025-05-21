const { check } = require("express-validator");
const moment = require("moment");
const validatorMiddleWare = require("../middleWares/validatorMiddleware");
const asyncHandler = require("express-async-handler");
const couponModel = require("../models/couponModel");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  validatorMiddleWare,
];

exports.createCouponValidator = [
  check("code")
    .notEmpty()
    .withMessage("code is required")
    .isLength({ min: 8, max: 8 })
    .withMessage("code must be 8 characters")
    .customSanitizer((value) => value.toUpperCase())
    .custom(async (value) =>
      couponModel.findOne({ code: value }).then((coupon) => {
        if (coupon) {
          return Promise.reject({
            message: "code already exists",
            statusCode: 404,
          });
        }
      })
    ),
  check("discount")
    .notEmpty()
    .withMessage("discount is required")
    .isNumeric()
    .withMessage("discount must be a number")
    .isFloat({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),
  check("expire")
    .notEmpty()
    .withMessage("expire is required")
    .custom((value) => {
      if (!moment(value, "MM/DD/YYYY", true).isValid()) {
        return Promise.reject({
          message: "expire must be a valid date in the format MM/DD/YYYY",
          statusCode: 404,
        });
      }
      if (moment(value).isBefore(moment())) {
        return Promise.reject({
          message: "expire must be a future date",
          statusCode: 404,
        });
      }
      return true;
    }),
  validatorMiddleWare,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  validatorMiddleWare,
];

exports.updateCouponValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Coupon Id Format")
    .custom(
      asyncHandler(async (id, { req }) => {
        const documentId = req.params.id;
        const exists = await couponModel.findById(id);
        if (!exists) {
          return Promise.reject({
            message: `No document For This Id: ${documentId}`,
            statusCode: 404,
          });
        }
        return true;
      })
    ),
  check("code")
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage("code must be 8 characters")
    .customSanitizer((value) => value.toUpperCase())
    .custom(async (value) =>
      couponModel.findOne({ code: value }).then((coupon) => {
        if (coupon) {
          return Promise.reject({
            message: "code already exists",
            statusCode: 404,
          });
        }
      })
    ),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("discount must be a number")
    .isFloat({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),
  check("expire")
    .optional()
    .custom((value) => {
      if (!moment(value, "MM/DD/YYYY", true).isValid()) {
        return Promise.reject({
          message: "expire must be a valid date in the format MM/DD/YYYY",
          statusCode: 404,
        });
      }
      if (moment(value).isBefore(moment())) {
        return Promise.reject({
          message: "expire must be a future date",
          statusCode: 404,
        });
      }
      return true;
    }),
  validatorMiddleWare,
];
