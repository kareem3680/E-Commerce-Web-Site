const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const Affiliate = require("../models/affiliateModel");
const Order = require("../models/affiliateModel");
const User = require("../models/userModel");
const generateReferralCode = require("../utils/generateReferralCode");

exports.registerAsAffiliate = asyncHandler(async (req, res, next) => {
  const existing = await Affiliate.findOne({ user: req.user._id });
  if (existing) {
    return next(new ApiError("You are already an affiliate", 400));
  }

  const referralCode = await generateReferralCode();
  const affiliate = await Affiliate.create({
    user: req.user._id,
    referralCode,
  });

  await User.findByIdAndUpdate(req.user._id, { role: "affiliate" });

  res.status(201).json({ message: "Affiliate account created", referralCode });
});

exports.getAffiliateDashboard = asyncHandler(async (req, res, next) => {
  const affiliate = await Affiliate.findOne({ user: req.user._id }).populate({
    path: "commissions.order",
    select: "totalAmount status createdAt",
  });

  if (!affiliate) {
    return next(new ApiError("Affiliate not found", 404));
  }

  const recentCommissions = affiliate.commissions
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  res.status(200).json({
    referralCode: affiliate.referralCode,
    totalClicks: affiliate.totalClicks,
    totalConversions: affiliate.totalConversions,
    totalCommission: affiliate.totalCommission,
    recentCommissions,
  });
});

exports.getAffiliateCommissions = asyncHandler(async (req, res, next) => {
  const affiliate = await Affiliate.findOne({ user: req.user._id }).populate(
    "commissions.order",
    "totalAmount createdAt status"
  );

  if (!affiliate) {
    return next(new ApiError("Affiliate not found", 404));
  }

  res.status(200).json({ commissions: affiliate.commissions });
});

exports.getAffiliateOrders = asyncHandler(async (req, res, next) => {
  const affiliate = await Affiliate.findOne({ user: req.user._id });
  if (!affiliate) {
    return next(new ApiError("Affiliate not found", 404));
  }

  const orders = await Order.find({ referralCodeUsed: affiliate.referralCode });

  res.status(200).json({ orders });
});

exports.trackReferralClick = asyncHandler(async (req, res, next) => {
  const { referralCode } = req.params;

  const affiliate = await Affiliate.findOne({ referralCode });
  if (!affiliate) {
    return next(new ApiError("Invalid referral code", 404));
  }

  affiliate.totalClicks += 1;
  await affiliate.save();

  res.status(200).json({ message: "Click tracked" });
});

exports.requestCommissionPayout = asyncHandler(async (req, res, next) => {
  const affiliate = await Affiliate.findOne({ user: req.user._id });
  if (!affiliate) {
    return next(new ApiError("Affiliate not found", 404));
  }

  if (affiliate.totalCommission < 50) {
    return next(new ApiError("affiliate amount must more 50", 404));
  }

  res.status(200).json({ message: "Payout request submitted" });
});
