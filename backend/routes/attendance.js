const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const Attendance = require("../models/Attendance");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const path = require("path");

router.post("/", requireAuth, async (req, res) => {
  try {
    const { date, groupId, childrenIds } = req.body;

    if (!date || !groupId || !childrenIds || !Array.isArray(childrenIds)) {
      return res.status(400).json({ message: "Некоректні дані" });
    }

    const attendance = new Attendance({
      date,
      group: groupId,
      children: childrenIds,
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Помилка при створенні запису", error });
  }
});

router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate({ path: "group", select: "name" })
      .populate({ path: "children", select: "fullName" });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Помилка при отриманні", error });
  }
});

router.get(
  "/export/csv",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const records = await Attendance.find()
        .populate("group", "name")
        .populate("children", "fullName");

      const csvData = records.map((record) => {
        return {
          date: record.date.toISOString().split("T")[0],
          group: record.group?.name || "—",
          children: record.children.map((c) => c.fullName).join(", "),
        };
      });

      const parser = new Parser({ fields: ["date", "group", "children"] });
      const csv = parser.parse(csvData);

      res.header("Content-Type", "text/csv");
      res.attachment("attendance.csv");
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: "Помилка при експорті CSV", error });
    }
  }
);
router.get(
  "/export/pdf",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const records = await Attendance.find()
        .populate("group", "name")
        .populate("children", "fullName");

      const doc = new PDFDocument();
      const filename = `attendance_${Date.now()}.pdf`;
      const fontPath = path.join(__dirname, "../fonts/Roboto-Regular.ttf");
      doc.registerFont("Roboto", fontPath);
      doc.font("Roboto");

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      doc.pipe(res);

      doc.fontSize(18).text("Журнал відвідуваності", { align: "center" });
      doc.moveDown();

      records.forEach((record, index) => {
        doc
          .fontSize(12)
          .text(`Дата: ${record.date.toISOString().split("T")[0]}`)
          .text(`Група: ${record.group?.name || "—"}`)
          .text(
            `Діти: ${
              record.children.length > 0
                ? record.children.map((c) => c.fullName).join(", ")
                : "немає"
            }`
          );
        doc.moveDown(1.5);

        if (index < records.length - 1)
          doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();
      });

      doc.end();
    } catch (error) {
      res.status(500).json({ message: "Помилка при експорті PDF", error });
    }
  }
);
module.exports = router;
