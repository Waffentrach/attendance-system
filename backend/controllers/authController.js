const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1. Тільки адміністратор має право створювати нового користувача
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Доступ заборонено" });
  }

  // 2. Перевірка обов’язкових полів
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Будь ласка, заповніть усі поля" });
  }

  // 3. Мінімальна довжина пароля
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Пароль має містити щонайменше 6 символів" });
  }

  try {
    // 4. Перевірка унікальності email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Користувач з таким email вже існує" });
    }

    // 5. Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Створення користувача
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "Користувач створений успішно" });
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера", details: err.message });
  }
};

exports.login = async (req, res) => {
  console.log("Login запит:", req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Невірний пароль" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
