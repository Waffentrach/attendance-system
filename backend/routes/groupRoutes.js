const express = require("express");
const router = express.Router();
const {
  createGroup,
  getGroups,
  assignTeacher,
  getMyGroup,
} = require("../controllers/groupController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, createGroup);
router.get("/", auth, getGroups);
router.put("/:groupId/assign-teacher", auth, assignTeacher);
router.get("/my", auth, getMyGroup);

module.exports = router;
