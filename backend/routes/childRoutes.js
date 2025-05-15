const express = require("express");
const router = express.Router();
const { createChild, getChildren } = require("../controllers/childController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, createChild);
router.get("/", auth, getChildren);

module.exports = router;
