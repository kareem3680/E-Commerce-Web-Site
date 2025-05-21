const { check } = require("express-validator");
const validatorMiddleWare = require("../middleWares/validatorMiddleware");

const userModel = require("../models/userModel");

exports.addAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("alias is required")
    .isLength({ min: 3 })
    .withMessage("alias must be at least 3 characters")
    .isLength({ max: 10 })
    .withMessage("alias must be at most 10 characters"),
  check("details")
    .notEmpty()
    .withMessage("details is required")
    .isLength({ min: 10 })
    .withMessage("details must be at least 10 characters")
    .isLength({ max: 40 })
    .withMessage("details must be at most 40 characters"),
  check("phone")
    .notEmpty()
    .withMessage("phone is required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("MobilePhone must be valid"),
  check("country").notEmpty().withMessage("country is required"),
  check("postalCode").notEmpty().withMessage("postalCode is required"),
  check("city").notEmpty().withMessage("city is required"),
  validatorMiddleWare,
];

exports.removeAddressValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((value) =>
      userModel
        .findOne({ addresses: { $elemMatch: { _id: value } } })
        .then((user) => {
          if (!user) {
            return Promise.reject({
              message: "No Address found",
              statusCode: 404,
            });
          }
        })
    ),
  validatorMiddleWare,
];
