const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email вже використовується" });

    const hashed = await bcrypt.hash(password, 10);
    const teacher = await User.create({
      name,
      email,
      password: hashed,
      role: "teacher",
    });
    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
