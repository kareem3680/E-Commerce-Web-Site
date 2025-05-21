const controllerHandler = require("./controllerHandler");
const categoryModel = require("../models/categoryModel");

exports.createCategory = controllerHandler.create(categoryModel);

exports.getSpecificCategory = controllerHandler.getSpecific(categoryModel);

exports.getCategories = controllerHandler.getAll(categoryModel);

exports.updateCategory = controllerHandler.update(categoryModel);

exports.deleteCategory = controllerHandler.delete(categoryModel);
