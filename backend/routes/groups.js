const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const Group = require("../models/Group");

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

module.exports = router;
