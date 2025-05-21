const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const Child = require("../models/Child");

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { fullName, birthDate, groupId } = req.body;

    if (!fullName || !birthDate || !groupId) {
      return res.status(400).json({ message: "Всі поля обовʼязкові" });
    }

    const child = new Child({
      fullName,
      birthDate,
      group: groupId,
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

module.exports = router;
