// Load env vars
require("dotenv").config({ path: "config.env" });

// Core
const express = require("express");
const morgan = require("morgan");

// Security & Performance
const compression = require("compression");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Custom
const dbConnection = require("./config/dataBase");
const mountRoutes = require("./routes");
const globalError = require("./middleWares/errorMiddleware");
const ApiError = require("./utils/apiError");

// App
const app = express();
app.use(express.json({ limit: "50kb" }));
app.set("trust proxy", 1);
app.use(cors());

// Security Middlewares
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api", limiter);
app.use(compression());

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connect DB
dbConnection();

// Routes
mountRoutes(app);

// Not Found Handler
app.use((req, res, next) => {
  next(new ApiError(`Can not find this route: ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(globalError);

// Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// Unhandled Rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.stack}`);
  server.close(() => process.exit(1));
});

// Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.stack}`);
  process.exit(1);
});
