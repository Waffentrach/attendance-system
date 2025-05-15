const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // пізніше
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }], // пізніше
});

module.exports = mongoose.model("Group", groupSchema);
