const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const Notification = require("../models/Notification");

router.post("/", requireAuth, requireRole("teacher"), async (req, res) => {
  const { to, message } = req.body;
  try {
    const notif = new Notification({ to, message });
    await notif.save();
    res.status(201).json(notif);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка при створенні повідомлення", error });
  }
});

router.get("/my", requireAuth, requireRole("parent"), async (req, res) => {
  try {
    const notes = await Notification.find({ to: req.user._id }).sort({
      date: -1,
    });
    res.json(notes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка при отриманні повідомлень", error });
  }
});

module.exports = router;
