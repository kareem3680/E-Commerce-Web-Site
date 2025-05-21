const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const settingModel = require("../models/settingModel");

exports.useSettings = asyncHandler(async (key) => {
  const setting = await settingModel.findOne({ key });
  if (!setting) throw new Error(`Setting not found for key: ${key}`);
  return setting.value;
});

exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await settingModel.find();
  if (!settings) {
    return next(new ApiError("No Settings found", 404));
  }
  res.status(200).json({
    status: "success",
    data: settings,
  });
});

exports.addSetting = asyncHandler(async (req, res, next) => {
  const setting = await settingModel.create(req.body);
  res.status(201).json({ setting });
});

exports.updateSetting = asyncHandler(async (req, res, next) => {
  const setting = await settingModel.findByIdAndUpdate(
    req.params.id,
    { value: req.body.value },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ message: "Setting updated successfully!", setting });
});
