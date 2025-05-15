const express = require("express");
const router = express.Router();
const { createTeacher, getTeachers } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.post("/teachers", auth, createTeacher);
router.get("/teachers", auth, getTeachers);

module.exports = router;
