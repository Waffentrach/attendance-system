const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const Child = require("../models/Child");

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { fullName, birthDate, groupId, parentId } = req.body;

    if (!fullName || !birthDate || !groupId) {
      return res.status(400).json({ message: "Всі поля обовʼязкові" });
    }

    const child = new Child({
      fullName,
      birthDate,
      group: groupId,
      parent: parentId,
    });

    await child.save();
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ message: "Помилка при створенні дитини", error });
  }
});

router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const children = await Child.find().populate("group", "name");
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: "Помилка при отриманні дітей", error });
  }
});
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    await Child.findByIdAndDelete(req.params.id);
    res.json({ message: "Дитину видалено" });
  } catch (error) {
    res.status(500).json({ message: "Помилка при видаленні дитини", error });
  }
});
router.get("/my", requireAuth, requireRole("parent"), async (req, res) => {
  try {
    const children = await Child.find({ parent: req.user._id }).populate(
      "group",
      "name"
    );
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: "Помилка при отриманні дітей", error });
  }
});

module.exports = router;
