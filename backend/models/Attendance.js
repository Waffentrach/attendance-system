const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
