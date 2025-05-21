const axios = require("axios");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const settingController = require("./settingController");
const controllerHandler = require("./controllerHandler");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxes = await settingController.useSettings("taxes");
  const shipping = await settingController.useSettings("shipping");

  const cart = await cartModel.findById(req.params.id);
  if (!cart) {
    return next(new ApiError("No cart found for this user", 404));
  }
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + (cartPrice * taxes) / 100 + shipping;
  const order = await orderModel.create({
    customer: req.user._id,
    items: cart.cartItems,
    cartPrice: cartPrice,
    taxes: (cartPrice * taxes) / 100,
    shipping: shipping,
    totalOrderPrice: totalOrderPrice,
    status: "pending",
  });
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});
    await cartModel.findByIdAndDelete(req.params.id);
  }
  res.status(201).json({ message: "Order complete", data: order });
});

const createCreditOrder = async (paymentData) => {
  const paymobOrderId = paymentData.order.id;
  const email = paymentData.order.shipping_data.email;
  const address = paymentData.order.shipping_data;

  const cart = await cartModel.findOne({ paymobOrderId });
  if (!cart) throw new Error("❌ Cart not found for this Paymob order");

  const user = await userModel.findOne({ email });
  if (!user) throw new Error("❌ User not found for this email");

  const taxes = await settingController.useSettings("taxes");
  const shipping = await settingController.useSettings("shipping");

  const cartPrice = cart.totalPriceAfterDiscount || cart.totalPrice;
  const totalOrderPrice = Number(paymentData.amount_cents) / 100;

  const shippingAddress = {
    details: address.street || "N/A",
    phone: address.phone_number || "N/A",
    city: address.city || "N/A",
    country: address.country || "N/A",
    postalCode: address.postal_code || "N/A",
  };

  const order = await orderModel.create({
    customer: user._id,
    shippingAddress,
    items: cart.cartItems,
    cartPrice,
    taxes: (cartPrice * taxes) / 100,
    shipping,
    totalOrderPrice,
    status: "Approved",
    paymentMethod: "Paymob",
    isPaid: true,
    paidAt: Date.now(),
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption);
    await cartModel.findByIdAndDelete(cart._id);
  }
};

exports.checkOutSession = asyncHandler(async (req, res, next) => {
  const { PAYMOB_API_KEY, PAYMOB_INTEGRATION_ID, PAYMOB_IFRAME_ID } =
    process.env;

  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new ApiError("No cart found for this user", 404));

  const taxPercentage = await settingController.useSettings("taxes");
  const shipping = await settingController.useSettings("shipping");
  const cartPrice = cart.totalPriceAfterDiscount || cart.totalPrice;
  const taxes = Math.round(cartPrice * (taxPercentage / 100));
  const totalOrderPrice = Number(cartPrice) + Number(shipping) + Number(taxes);

  const address = (req.user.addresses && req.user.addresses[0]) || {};
  try {
    const authRes = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        api_key: PAYMOB_API_KEY,
      }
    );
    const token = authRes.data.token;

    const orderRes = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: false,
        amount_cents: (totalOrderPrice * 100).toString(),
        currency: "EGP",
        items: [],
      }
    );
    const orderId = orderRes.data.id;

    cart.paymobOrderId = orderId;
    await cart.save();

    const paymentKeyRes = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: token,
        amount_cents: (totalOrderPrice * 100).toString(),
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: address.apartment || "N/A",
          email: req.user.email,
          floor: address.floor || "N/A",
          first_name: req.user.name?.split(" ")[0] || "User",
          street: address.details || "N/A",
          building: address.building || "N/A",
          phone_number: address.phone || "+201000000000",
          shipping_method: "PKG",
          postal_code: address.postalCode || "00000",
          city: address.city || "Cairo",
          country: address.country || "EG",
          last_name: req.user.name?.split(" ").slice(1).join(" ") || "Customer",
          state: address.city || "Cairo",
        },
        currency: "EGP",
        integration_id: PAYMOB_INTEGRATION_ID,
      }
    );

    const paymentToken = paymentKeyRes.data.token;
    const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;
    res.status(200).json({ message: "success", data: { iframeURL } });
  } catch (err) {
    console.error("Paymob error:", err.response?.data || err.message);
    return next(new ApiError("Error in payment session", 500));
  }
});

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const event = req.body;

  if (
    event.type === "TRANSACTION" &&
    event.obj.success === true &&
    event.obj.order?.payment_status === "PAID"
  ) {
    const paymentData = event.obj;

    try {
      await createCreditOrder(paymentData);
      console.log(
        `✅ Paymob Payment successful for Order ID ${
          paymentData.order.id
        } – Amount: ${paymentData.amount_cents / 100} EGP`
      );
    } catch (err) {
      console.error("❌ Failed to create order from Paymob webhook:", err);
      return res.status(500).send("Server Error");
    }
  } else if (event.type !== "TRANSACTION") {
    console.log(
      `ℹ️ Received event type '${event.type}' - Ignored for order creation`
    );
  } else {
    console.log("❌ Unsuccessful or irrelevant Paymob transaction");
    console.log("Received Event:", JSON.stringify(event, null, 2));
  }

  res.status(200).send("Received");
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError("No order found with this ID", 404));
  }
  if (req.body.isPaid) {
    order.isPaid = true;
    order.paidAt = Date.now();
  }
  if (req.body.status == "delivered") {
    order.status = "delivered";
    order.deliveredAt = Date.now();
  }
  order.status = req.body.status;
  await order.save();
  res.json({ message: "Order updated successfully", data: order });
});

exports.filterOrderForUsers = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") req.filterObject = { customer: req.user._id };
  next();
});

exports.getAllOrders = controllerHandler.getAll(orderModel);

exports.deleteOrder = controllerHandler.delete(orderModel);
