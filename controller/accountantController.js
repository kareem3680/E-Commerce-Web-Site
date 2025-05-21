const asyncHandler = require("express-async-handler");
const CommissionRequest = require("../models/commissionRequestModel");
const Order = require("../models/orderModel");
const Affiliate = require("../models/affiliateModel");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

exports.getAllCommissionRequests = asyncHandler(async (req, res) => {
  const requests = await CommissionRequest.find()
    .populate({
      path: "affiliate",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({ requests });
});

exports.reviewCommissionRequest = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const { action, notes } = req.body;

  if (!["approved", "rejected"].includes(action)) {
    return next(new ApiError("Invalid action", 400));
  }

  const request = await CommissionRequest.findById(requestId);
  if (!request) return next(new ApiError("Request not found", 404));

  request.status = action;
  request.reviewedBy = req.user._id;
  request.notes = notes || "";
  await request.save();

  res.status(200).json({ message: `Request ${action}`, request });
});

exports.markAsPaid = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;

  const request = await CommissionRequest.findById(requestId);
  if (!request) return next(new ApiError("Request not found", 404));

  request.status = "paid";
  await request.save();

  res.status(200).json({ message: "Marked as paid", request });
});

exports.getPaidOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: "paid" }).populate(
    "user",
    "name email"
  );
  const totalRevenue = orders.reduce(
    (acc, order) => acc + order.totalAmount,
    0
  );

  res.status(200).json({ totalRevenue, count: orders.length, orders });
});

exports.getAffiliatesCommissionReport = asyncHandler(async (req, res) => {
  const affiliates = await Affiliate.find().populate("user", "name email");

  const report = affiliates.map((aff) => ({
    name: aff.user.name,
    email: aff.user.email,
    referralCode: aff.referralCode,
    totalConversions: aff.totalConversions,
    totalCommission: aff.totalCommission,
  }));

  res.status(200).json({ report });
});
