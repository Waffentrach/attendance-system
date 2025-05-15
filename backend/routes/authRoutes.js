const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", auth, register); // 🔒 доступ лише з токеном

router.post("/login", login);

module.exports = router;
