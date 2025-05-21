// routes/users.js
const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const User = require("../models/User");

// Отримати всіх користувачів (тільки admin)
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Змінити роль користувача (тільки admin)
router.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");
  res.json(user);
});

// Видалити користувача (тільки admin)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Користувача видалено" });
});

module.exports = router;
