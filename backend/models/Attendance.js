const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  children: [
    {
      child: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
      reason: { type: String, default: null },
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
