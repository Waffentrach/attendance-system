module.exports = (role) => (req, res, next) => {
  console.log("➡️ req.user у requireRole:", req.user);

  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: "Доступ заборонено" });
  }
  next();
};
