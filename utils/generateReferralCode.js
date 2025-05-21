const Affiliate = require("../models/affiliateModel");

const generateReferralCode = async () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  let exists = true;

  while (exists) {
    code = "";
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const found = await Affiliate.findOne({ referralCode: code });
    if (!found) exists = false;
  }

  return code;
};

module.exports = generateReferralCode;
