const userRoute = require("./userRoute");
const adminRoute = require("./adminRoute");
const authRoute = require("./authRoute");
const forgetPasswordRoute = require("./forgetPasswordRoute");
const categoryRoute = require("./categoryRoute");
const productRoute = require("./productRoute");
const couponRoute = require("./couponRoute");
const reviewRoute = require("./reviewRoute");
const wishlistRoute = require("./wishlistRoute");
const addressRoute = require("./addressRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");
const affiliateRoutes = require("./affiliateRoute");
const accountantRoutes = require("./accountantRoute");
const settingRoute = require("./settingRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/admin", adminRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/forgetPassword", forgetPasswordRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlists", wishlistRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/carts", cartRoute);
  app.use("/api/v1/orders", orderRoute);
  app.use("/api/v1/affiliates", affiliateRoutes);
  app.use("/api/v1/accountants", accountantRoutes);
  app.use("/api/v1/settings", settingRoute);
};

module.exports = mountRoutes;
