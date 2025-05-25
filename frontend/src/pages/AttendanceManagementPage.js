import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AttendanceManagementPage = () => {
  const { token } = useContext(AuthContext);
  const [records, setRecords] = useState([]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      alert("Помилка при завантаженні журналу");
    }
  };

  const exportCSV = () => {
    window.open(
      `http://localhost:5000/api/attendance/export/csv?token=${token}`,
      `_blank`
    );
  };

  const exportPDF = () => {
    window.open(
      `http://localhost:5000/api/attendance/export/pdf?token=${token}`,
      `_blank`
    );
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Журнал відвідуваності</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={exportCSV}>⬇️ Експорт у CSV</button>
        <button onClick={exportPDF} style={{ marginLeft: "1rem" }}>
          📄 Експорт у PDF
        </button>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Група</th>
            <th>Діти</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.date.split("T")[0]}</td>
              <td>{r.group?.name || "—"}</td>
              <td>
                {r.children.length > 0
                  ? r.children.map((c) => c.child?.fullName || "—").join(", ")
                  : "немає"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceManagementPage;
