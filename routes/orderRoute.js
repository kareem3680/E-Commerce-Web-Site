const express = require("express");
const orderController = require("../controller/orderController");

const router = express.Router();
const authController = require("../controller/authController");

router.route("/webhook-paymob").post(orderController.webhookCheckout);

router
  .route("/")
  .get(
    authController.protect,
    orderController.filterOrderForUsers,
    orderController.getAllOrders
  );
router
  .route("/:id")
  .post(
    authController.protect,
    authController.allowedTo("customer"),
    orderController.createCashOrder
  );
router
  .route("/checkout-session/:id")
  .get(
    authController.protect,
    authController.allowedTo("customer"),
    orderController.checkOutSession
  );

router
  .route("/:id")
  .put(
    authController.protect,
    authController.allowedTo("admin"),
    orderController.updateOrderStatus
  );

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    orderController.deleteOrder
  );

module.exports = router;
