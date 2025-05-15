const Child = require("../models/Child");
const Group = require("../models/Group");

exports.createChild = async (req, res) => {
  try {
    const { name, birthDate, groupId } = req.body;
    const child = await Child.create({ name, birthDate, group: groupId });

    if (groupId) {
      await Group.findByIdAndUpdate(groupId, {
        $push: { children: child._id },
      });
    }

    res.status(201).json(child);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChildren = async (req, res) => {
  try {
    const children = await Child.find().populate("group");
    res.json(children);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
