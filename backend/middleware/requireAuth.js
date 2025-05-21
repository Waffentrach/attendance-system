const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Немає токену" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Користувач не знайдений" });
    }

    req.user = user; // Додаємо користувача до запиту
    next();
  } catch (err) {
    res.status(401).json({ message: "Недійсний токен" });
  }
};

module.exports = requireAuth;
