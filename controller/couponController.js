const couponModel = require("../models/couponModel");
const controllerHandler = require("./controllerHandler");

exports.createCoupon = controllerHandler.create(couponModel);

exports.getSpecificCoupon = controllerHandler.getSpecific(couponModel);

exports.getCoupons = controllerHandler.getAll(couponModel);

exports.updateCoupon = controllerHandler.update(couponModel);

exports.deleteCoupon = controllerHandler.delete(couponModel);
