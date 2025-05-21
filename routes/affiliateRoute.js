const express = require("express");
const {
  registerAsAffiliate,
  getAffiliateDashboard,
  getAffiliateCommissions,
  getAffiliateOrders,
  trackReferralClick,
  requestCommissionPayout,
} = require("../controller/affiliateController");
const authController = require("../controller/authController");
const router = express.Router();

router.post(
  "/register",
  authController.protect,
  authController.allowedTo("customer", "affiliate"),
  registerAsAffiliate
);
router.get(
  "/dashboard",
  authController.protect,
  authController.allowedTo("affiliate"),
  getAffiliateDashboard
);
router.get(
  "/commissions",
  authController.protect,
  authController.allowedTo("affiliate"),
  getAffiliateCommissions
);
router.get(
  "/orders",
  authController.protect,
  authController.allowedTo("affiliate"),
  getAffiliateOrders
);
router.post("/track-click/:referralCode", trackReferralClick);

router.post(
  "/request-payout",
  authController.protect,
  authController.allowedTo("affiliate"),
  requestCommissionPayout
);

module.exports = router;
