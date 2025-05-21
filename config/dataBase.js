const mongoose = require("mongoose");

dbConnection = () => {
  mongoose.connect(process.env.MONGO_URI).then((conn) => {
    console.log(`Data Base Connected: ${conn.connection.host}`);
  });
};
module.exports = dbConnection;
