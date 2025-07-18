import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TeacherJournalPage = () => {
  const { token } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [children, setChildren] = useState([]);
  const [date, setDate] = useState("");
  const [selectedChildren, setSelectedChildren] = useState([]);
  const navigate = useNavigate();

  const fetchRecords = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/attendance/my/teacher",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setRecords(res.data);
  };

  const fetchChildren = async () => {
    const res = await axios.get("http://localhost:5000/api/groups/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const group = res.data;
    if (group && group.children) {
      setChildren(group.children);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const groupRes = await axios.get("http://localhost:5000/api/groups/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.post(
        "http://localhost:5000/api/attendance",
        {
          date,
          groupId: groupRes.data._id,
          childrenIds: selectedChildren,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDate("");
      setSelectedChildren([]);
      fetchRecords();
    } catch (err) {
      alert("Помилка при створенні запису");
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchRecords();
    fetchChildren();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Мій журнал</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <label>Дата:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <div style={{ marginTop: "1rem" }}>
          <p>Виберіть присутніх дітей:</p>
          {children.map((child) => (
            <div key={child._id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedChildren.includes(child._id)}
                  onChange={() => handleCheckboxChange(child._id)}
                />
                {child.fullName}
              </label>
            </div>
          ))}
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>
          Зберегти
        </button>
        <button
          type="button"
          style={{ marginTop: "1rem", marginLeft: "1rem" }}
          onClick={() => navigate("/teacher/notify")}
        >
          Надіслати повідомлення
        </button>
      </form>

      <h3>Історія</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Діти</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.date.split("T")[0]}</td>
              <td>
                {r.children.length > 0
                  ? r.children.map((c) => c.child?.fullName).join(", ")
                  : "немає"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherJournalPage;
