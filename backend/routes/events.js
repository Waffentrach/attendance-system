const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const Event = require("../models/Event");

// Отримати всі події (для батьків і вихователів)
router.get("/", requireAuth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Помилка при отриманні подій" });
  }
});

// Створити подію (лише вихователь)
router.post("/", requireAuth, requireRole("teacher"), async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: "Усі поля обов'язкові" });
    }

    const event = new Event({ title, description, date });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("❌ Помилка при створенні події:", err);
    res.status(500).json({ message: "Серверна помилка" });
  }
});

module.exports = router;
