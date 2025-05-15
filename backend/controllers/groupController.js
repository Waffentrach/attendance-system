const Group = require("../models/Group");

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.create({ name, description });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("teacher").populate("children");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignTeacher = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { teacherId } = req.body;

    const updated = await Group.findByIdAndUpdate(
      groupId,
      { teacher: teacherId },
      { new: true }
    ).populate("teacher");

    if (!updated) return res.status(404).json({ error: "Групу не знайдено" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getMyGroup = async (req, res) => {
  console.log("ID з токена:", req.user.id);

  try {
    const group = await Group.findOne({ teacher: req.user.id }).populate(
      "children"
    );
    if (!group) return res.status(404).json({ error: "Групу не знайдено" });

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
