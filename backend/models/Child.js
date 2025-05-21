const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
});

module.exports = mongoose.model("Child", childSchema);
