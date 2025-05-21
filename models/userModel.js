const dotenv = require("dotenv");

const bcrypt = require("bcryptjs");

dotenv.config({ path: "config.env" });

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      unique: [true, "category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [30, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique"],
      lowercase: true,
    },
    password: {
      type: String,
      minlength: [5, "Password must be at least 5 character"],
    },
    changedPasswordAt: {
      type: Date,
    },
    passwordResetCode: {
      type: String,
    },
    passwordResetCodeExpiresAt: {
      type: Date,
    },
    passwordResetCodeVerified: {
      type: Boolean,
    },
    twoFactorCode: {
      type: Number,
    },
    twoFactorExpires: {
      type: Date,
    },
    phone: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "accountant", "seller", "customer", "affiliate"],
      default: "customer",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        phone: String,
        details: String,
        country: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

const SetImageURL = (doc) => {
  if (doc.profileImage) {
    const imageURL = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageURL;
  }
};

userSchema.post("init", (doc) => {
  SetImageURL(doc);
});

userSchema.post("save", (doc) => {
  SetImageURL(doc);
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
