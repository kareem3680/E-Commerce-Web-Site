const controllerHandler = require("./controllerHandler");
const productModel = require("../models/productModel");

exports.createProduct = controllerHandler.create(productModel);

exports.getSpecificProduct = controllerHandler.getSpecific(productModel);

exports.getProducts = controllerHandler.getAll(productModel, "product");

exports.updateProduct = controllerHandler.update(productModel);

exports.deleteProduct = controllerHandler.delete(productModel);
