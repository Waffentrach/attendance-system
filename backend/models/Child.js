const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
});

module.exports = mongoose.model("Child", childSchema);
