const { check } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleWare = require("../middleWares/validatorMiddleware");
const asyncHandler = require("express-async-handler");
const userController = require("../controller/userController");
const userModel = require("../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  validatorMiddleWare,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("User name must be at most 32 characters")
    .custom((value, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(value);
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email must valid")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject({
            message: `E-Mail already exists`,
            statusCode: 400,
          });
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirmation) {
        return Promise.reject({
          message: "Passwords do not match",
          statusCode: 400,
        });
      }
      return true;
    }),

  check("passwordConfirmation")
    .notEmpty()
    .withMessage("password confirmation is required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("MobilePhone must be valid"),

  check("profileImage").optional(),

  validatorMiddleWare,
];

exports.updateUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid User Id Format")
    .custom(
      asyncHandler(async (id, { req }) => {
        const documentId = req.params.id;
        const exists = await userModel.findById(id);
        if (!exists) {
          return Promise.reject({
            message: `No document For This Id: ${documentId}`,
            statusCode: 400,
          });
        }
        return true;
      })
    ),

  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("User name must be at most 32 characters")
    .custom((value, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(value);
      }
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("User email must valid")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject({
            message: `E-Mail already exists`,
            statusCode: 400,
          });
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("MobilePhone must be valid"),

  check("profileImage").optional(),

  validatorMiddleWare,
];

exports.changePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .custom(
      asyncHandler(async (value, { req }) => {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
          return Promise.reject({
            message: `E-Mail or password is wrong`,
            statusCode: 400,
          });
        }
        const isMatch = await bcrypt.compare(value, user.password);
        if (!isMatch) {
          return Promise.reject({
            message: `E-Mail or password is wrong`,
            statusCode: 400,
          });
        }
        return true;
      })
    ),

  check("newPassword")
    .notEmpty()
    .withMessage("newPassword is required")
    .isLength({ min: 6 })
    .withMessage("newPassword must be at least 6 characters")
    .custom((newPassword, { req }) => {
      if (newPassword !== req.body.newPasswordConfirm) {
        return Promise.reject({
          message: `Passwords do not match`,
          statusCode: 400,
        });
      }
      return true;
    }),

  check("newPasswordConfirm")
    .notEmpty()
    .withMessage("password confirmation is required"),

  validatorMiddleWare,
];
