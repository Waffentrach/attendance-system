const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  records: [
    {
      child: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
      present: Boolean,
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
