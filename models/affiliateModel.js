const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const affiliateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    referralCode: { type: String, required: true, unique: true },
    totalClicks: { type: Number, default: 0 },
    totalConversions: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    commissions: [commissionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Affiliate", affiliateSchema);
