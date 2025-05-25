const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // ← рекомендується
  },
});

module.exports = mongoose.model("Child", childSchema);
