const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Немає токена або неправильний формат" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // записуємо у req.user щоб мати доступ у контролерах
    next();
  } catch (err) {
    return res.status(401).json({ message: "Недійсний токен" });
  }
};

module.exports = authMiddleware;
