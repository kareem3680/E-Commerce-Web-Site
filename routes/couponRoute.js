const express = require("express");

const router = express.Router();

const couponController = require("../controller/couponController");
const couponValidator = require("../validators/couponValidator");
const authController = require("../controller/authController");

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    couponController.getCoupons
  )
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    couponValidator.createCouponValidator,
    couponController.createCoupon
  );

router
  .route("/:id")
  .get(couponValidator.getCouponValidator, couponController.getSpecificCoupon)
  .put(
    authController.protect,
    authController.allowedTo("admin"),
    couponValidator.updateCouponValidator,
    couponController.updateCoupon
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    couponValidator.deleteCouponValidator,
    couponController.deleteCoupon
  );

module.exports = router;
