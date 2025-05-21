const controllerHandler = require("./controllerHandler");
const reviewModel = require("../models/reviewModel");

exports.setRoutes = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObject = filterObject;
  next();
};

exports.createReview = controllerHandler.create(reviewModel);

exports.getSpecificReview = controllerHandler.getSpecific(reviewModel);

exports.getReviews = controllerHandler.getAll(reviewModel);

exports.updateReview = controllerHandler.update(reviewModel);

exports.deleteReview = controllerHandler.delete(reviewModel);
