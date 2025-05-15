import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherDashboard = () => {
  const [group, setGroup] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/groups/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(res.data);

        const initial = {};
        res.data.children.forEach((child) => {
          initial[child._id] = true;
        });
        setAttendance(initial);
      } catch (err) {
        alert("Не вдалося отримати групу");
        console.error(err);
      }
    };

    fetchGroup();
  }, [token]);

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      if (!group?._id) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/${group._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Помилка завантаження історії", err);
      }
    };

    fetchAttendanceHistory();
  }, [group, token]);

  const handleCheckboxChange = (childId) => {
    setAttendance((prev) => ({
      ...prev,
      [childId]: !prev[childId],
    }));
  };

  const handleSave = async () => {
    try {
      const records = Object.entries(attendance).map(([childId, present]) => ({
        child: childId,
        present,
      }));

      await axios.post(
        "http://localhost:5000/api/attendance",
        {
          date,
          group: group._id,
          records,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Журнал успішно збережено ✅");

      const res = await axios.get(
        `http://localhost:5000/api/attendance/${group._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(res.data);
    } catch (err) {
      alert("Помилка збереження журналу ❌");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Журнал відвідуваності</h2>

      <div style={styles.dateRow}>
        <label style={styles.label}>Дата:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />
      </div>

      {group ? (
        <div>
          <ul style={styles.list}>
            {group.children.map((child) => (
              <li key={child._id} style={styles.listItem}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={attendance[child._id] || false}
                    onChange={() => handleCheckboxChange(child._id)}
                    style={styles.checkbox}
                  />
                  {child.name}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleSave} style={styles.saveButton}>
            💾 Зберегти
          </button>

          <hr style={styles.divider} />

          <h3 style={styles.subtitle}>Історія відвідуваності</h3>
          {history.length === 0 ? (
            <p>Немає записів</p>
          ) : (
            history.map((record) => (
              <div key={record._id} style={styles.historyBlock}>
                <strong>{new Date(record.date).toLocaleDateString("uk-UA")}</strong>
                <ul style={styles.historyList}>
                  {record.records.map((r) => (
                    <li key={r.child._id}>
                      {r.child.name} —{" "}
                      {r.present ? "✅ Присутній" : "❌ Відсутній"}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      ) : (
        <p>Завантаження групи...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "sans-serif",
    background: "#fdfbf5",
    borderRadius: "12px",
    maxWidth: "700px",
    margin: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginTop: "2rem",
    marginBottom: "1rem",
  },
  dateRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.2rem",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginBottom: "1.5rem",
  },
  listItem: {
    marginBottom: "0.8rem",
    padding: "0.5rem 1rem",
    background: "#fffef3",
    border: "1px solid #eee",
    borderRadius: "6px",
  },
  checkboxLabel: {
    fontSize: "1rem",
  },
  checkbox: {
    marginRight: "0.8rem",
    transform: "scale(1.2)",
  },
  saveButton: {
    background: "#fff3b0",
    border: "none",
    padding: "0.7rem 1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "block",
    margin: "0 auto",
    fontSize: "1rem",
  },
  divider: {
    margin: "2rem 0",
    border: "none",
    borderTop: "1px solid #ddd",
  },
  historyBlock: {
    marginBottom: "1rem",
    padding: "1rem",
    background: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #eee",
  },
  historyList: {
    listStyle: "none",
    paddingLeft: 0,
    marginTop: "0.5rem",
  },
};

export default TeacherDashboard;
