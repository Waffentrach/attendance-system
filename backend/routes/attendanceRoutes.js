const express = require("express");
const router = express.Router();
const {
  createAttendance,
  getAttendanceByGroup,
} = require("../controllers/attendanceController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, createAttendance);
router.get("/:groupId", auth, getAttendanceByGroup);

module.exports = router;
