const mongoose = require("mongoose");

const commissionPayoutRequestSchema = new mongoose.Schema(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Accountant
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CommissionPayoutRequest",
  commissionPayoutRequestSchema
);
