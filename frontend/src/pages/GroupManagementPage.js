import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const GroupManagementPage = () => {
  const { token } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const fetchGroups = async () => {
    const res = await axios.get("http://localhost:5000/api/groups", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGroups(res.data);
  };

  const fetchTeachers = async () => {
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTeachers(res.data.filter((u) => u.role === "teacher"));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/groups",
        { name, teacherId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setTeacherId("");
      fetchGroups();
    } catch (err) {
      alert("Не вдалося створити групу");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити групу?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGroups();
      setGroups(groups.filter((g) => g._id !== id));
    } catch (err) {
      alert("Помилка при видаленні");
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchTeachers();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Групи</h2>
      <form onSubmit={handleCreateGroup} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Назва групи"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          required
        >
          <option value="">-- Виберіть вихователя --</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.email}
            </option>
          ))}
        </select>
        <button type="submit">Створити</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Вихователь</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g._id}>
              <td>{g.name}</td>
              <td>{g.teacher?.email || "—"}</td>
              <td>
                <button onClick={() => handleDelete(g._id)}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupManagementPage;
