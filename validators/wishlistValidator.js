const { check } = require("express-validator");
const validatorMiddleWare = require("../middleWares/validatorMiddleware");
const productModel = require("../models/productModel");

exports.addProductToWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid product Id Format")
    .custom(async (val, { req }) => {
      const productExists = await productModel.findById(req.body.productId);
      if (!productExists) {
        return Promise.reject({
          message: `This product not available`,
          statusCode: 404,
        });
      }
    }),
  validatorMiddleWare,
];

exports.removeProductFromWishlistValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid product Id Format")
    .custom(async (val, { req }) => {
      const productExists = await productModel.findById(req.params.id);
      if (!productExists) {
        return Promise.reject({
          message: `This product not available`,
          statusCode: 404,
        });
      }
    }),
  validatorMiddleWare,
];
