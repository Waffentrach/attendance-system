const Attendance = require("../models/Attendance");

exports.createAttendance = async (req, res) => {
  try {
    const { date, groupId, records } = req.body;

    const exists = await Attendance.findOne({ date, group: groupId });
    if (exists)
      return res
        .status(400)
        .json({ error: "Відвідування вже відмічене на цю дату." });

    const newAttendance = await Attendance.create({
      date,
      group: groupId,
      records,
    });

    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAttendanceByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const result = await Attendance.find({ group: groupId }).populate(
      "records.child"
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
