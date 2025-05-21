const express = require("express");
const {
  getAllCommissionRequests,
  reviewCommissionRequest,
  markAsPaid,
  getPaidOrders,
  getAffiliatesCommissionReport,
} = require("../controller/accountantController");

const authController = require("../controller/authController");
const router = express.Router();

router.get(
  "/commission-requests",
  authController.protect,
  authController.allowedTo("accountant"),
  getAllCommissionRequests
);
router.put(
  "/commission-requests/:requestId/review",
  authController.protect,
  authController.allowedTo("accountant"),
  reviewCommissionRequest
);
router.put(
  "/commission-requests/:requestId/pay",
  authController.protect,
  authController.allowedTo("accountant"),
  markAsPaid
);

router.get(
  "/paid-orders",
  authController.protect,
  authController.allowedTo("accountant"),
  getPaidOrders
);
router.get(
  "/affiliate-commissions",
  authController.protect,
  authController.allowedTo("accountant"),
  getAffiliatesCommissionReport
);

module.exports = router;
