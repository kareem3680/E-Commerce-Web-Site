const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");
const userModel = require("../models/userModel");

exports.getMyData = asyncHandler(async (req, res, next) => {
  const document = await userModel.findById(req.user._id);
  if (!document) {
    return next(new ApiError(`No document For This id : ${req.user._id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.updateMyData = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document For This Id : ${req.user._id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.updateMyPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 8),
      changedPasswordAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.deactivateMyUser = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  res.status(200).json({ message: "Deactivated Success" });
});
