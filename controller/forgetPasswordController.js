const dotenv = require("dotenv");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const createToken = require("../utils/createToken");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const sendEmails = require("../utils/sendEmail");

dotenv.config({ path: "config.env" });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`No user found with this email: ${req.body.email}`, 404)
    );
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedResetCode;
  user.passwordResetCodeExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.passwordResetCodeVerified = false;
  await user.save();

  try {
    await sendEmails({
      email: user.email,
      subject: "Reset your password",
      message: `Hello ${user.name},\n\nTo reset your password, please use the following code: ${resetCode}\n\nThis code will expire in 10 minutes.\n\nThank you.`,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpiresAt = undefined;
    user.passwordResetCodeVerified = undefined;
    await user.save();
    return next(new ApiError("Failed to send reset email", 500));
  }

  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to your email" });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await userModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetCodeExpiresAt: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 401));
  }
  user.passwordResetCodeVerified = true;
  await user.save();
  res.status(200).json({ status: "success" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(
      new ApiError(`No user found with this email: ${req.body.email}`, 404)
    );
  }
  if (!user.passwordResetCodeVerified) {
    return next(new ApiError("Reset code is not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCodeVerified = undefined;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpiresAt = undefined;
  await user.save();
  const token = createToken(user._id);
  res
    .status(200)
    .json({ status: "success", message: "Password reset successfully", token });
});
