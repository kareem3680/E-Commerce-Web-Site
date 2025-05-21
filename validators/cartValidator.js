const { check } = require("express-validator");
const validatorMiddleWare = require("../middleWares/validatorMiddleware");

exports.addProductToCartValidator = [
  check("productId").isMongoId().withMessage("Invalid productId Format"),
  validatorMiddleWare,
];

exports.removeProductFromCartValidator = [
  check("id").isMongoId().withMessage("Invalid cart Id Format"),
  validatorMiddleWare,
];

exports.updateProductQuantityInCartValidator = [
  check("id").isMongoId().withMessage("Invalid cart Id Format"),
  validatorMiddleWare,
];

exports.applyCouponToCartValidator = [
  check("code")
    .optional()
    .isLength({ min: 8, max: 8 })
    .withMessage("code must be 8 characters")
    .customSanitizer((value) => value.toUpperCase()),
  validatorMiddleWare,
];
