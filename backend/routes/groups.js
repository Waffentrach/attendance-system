const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const Group = require("../models/Group");
const Child = require("../models/Child");

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { name, teacherId } = req.body;

    if (!name || !teacherId) {
      return res
        .status(400)
        .json({ message: "Імʼя групи і викладач обовʼязкові" });
    }

    const newGroup = new Group({ name, teacher: teacherId });
    await newGroup.save();

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: "Помилка при створенні групи", error });
  }
});

router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const groups = await Group.find().populate("teacher", "email role");
  res.json(groups);
});
router.get("/my", requireAuth, requireRole("teacher"), async (req, res) => {
  try {
    const group = await Group.findOne({ teacher: req.user._id }).lean();

    if (!group) return res.status(404).json({ message: "Групу не знайдено" });

    const children = await Child.find({ group: group._id });

    res.json({ ...group, children });
  } catch (error) {
    res.status(500).json({ message: "Помилка при отриманні групи", error });
  }
});
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: "Групу видалено" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Помилка при видаленні групи", error: err });
  }
});
module.exports = router;
