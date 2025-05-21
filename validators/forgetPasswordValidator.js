const { check } = require("express-validator");
const validatorMiddleWare = require("../middleWares/validatorMiddleware");

exports.forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  validatorMiddleWare,
];

exports.verifyResetCodeValidator = [
  check("resetCode").notEmpty().withMessage("resetCode is required"),
  validatorMiddleWare,
];

exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  check("newPassword")
    .notEmpty()
    .withMessage("newPassword is required")
    .isLength({ min: 6 })
    .withMessage("newPassword must be at least 6 characters")
    .custom((newPassword, { req }) => {
      if (newPassword !== req.body.confirmNewPassword) {
        return Promise.reject({
          message: "Passwords do not match",
          statusCode: 403,
        });
      }
      return true;
    }),

  check("confirmNewPassword")
    .notEmpty()
    .withMessage("confirmNewPassword is required"),

  validatorMiddleWare,
];
