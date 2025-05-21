const express = require("express");

const router = express.Router({ mergeParams: true });

const reviewController = require("../controller/reviewController");
const reviewValidator = require("../validators/reviewValidator");
const authController = require("../controller/authController");

router
  .route("/")
  .get(
    reviewController.createFilterObject,
    reviewValidator.getAllReviewsValidator,
    reviewController.getReviews
  )
  .post(
    authController.protect,
    authController.allowedTo("customer"),
    reviewController.setRoutes,
    reviewValidator.createReviewValidator,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewValidator.getReviewValidator, reviewController.getSpecificReview)
  .put(
    authController.protect,
    authController.allowedTo("customer"),
    reviewValidator.updateReviewValidator,
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    reviewValidator.deleteReviewValidator,
    reviewController.deleteReview
  );

module.exports = router;
