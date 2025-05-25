const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
