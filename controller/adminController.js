const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const controllerHandler = require("./controllerHandler");
const userModel = require("../models/userModel");

exports.createUser = controllerHandler.create(userModel);

exports.getSpecificUser = controllerHandler.getSpecific(userModel);

exports.getUsers = controllerHandler.getAll(userModel);

exports.updateUser = controllerHandler.update(userModel);

exports.deleteUser = controllerHandler.delete(userModel);

exports.changePasswordHandler = asyncHandler(async (req, res, next) => {
  const { newPassword, email } = req.body;
  const document = await userModel.findOneAndUpdate(
    { email },
    {
      password: await bcrypt.hash(newPassword, 8),
      changedPasswordAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No user found for this email: ${email}`, 404));
  }
  res.status(200).json({ data: document });
});
