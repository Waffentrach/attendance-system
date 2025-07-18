const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const attendanceRoutes = require("./routes/attendance");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/groups", require("./routes/groups"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/children", require("./routes/children"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/users", require("./routes/users"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", require("./routes/notifications"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB підключено");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Сервер працює на порті ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ Помилка підключення до MongoDB:", err));
