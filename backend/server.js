const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const groupRoutes = require("./routes/groupRoutes");
const childRoutes = require("./routes/childRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const cors = require("cors");

dotenv.config();
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/children", childRoutes);
app.use("/api/attendance", attendanceRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Підключено до MongoDB");
    app.listen(process.env.PORT || 5000, () => console.log("Сервер запущено"));
  })
  .catch((err) => console.error("Помилка підключення:", err));
