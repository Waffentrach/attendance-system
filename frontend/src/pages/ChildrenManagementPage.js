import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ChildrenManagementPage = () => {
  const { token } = useContext(AuthContext);
  const [children, setChildren] = useState([]);
  const [groups, setGroups] = useState([]);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [groupId, setGroupId] = useState("");

  const fetchChildren = async () => {
    const res = await axios.get("http://localhost:5000/api/children", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChildren(res.data);
  };

  const fetchGroups = async () => {
    const res = await axios.get("http://localhost:5000/api/groups", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGroups(res.data);
  };

  const handleCreateChild = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/children",
        { fullName, birthDate, groupId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFullName("");
      setBirthDate("");
      setGroupId("");
      fetchChildren();
    } catch (err) {
      alert("Не вдалося створити дитину");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити дитину?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/children/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChildren(children.filter((c) => c._id !== id));
    } catch (err) {
      alert("Помилка при видаленні");
    }
  };

  useEffect(() => {
    fetchChildren();
    fetchGroups();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Діти</h2>
      <form onSubmit={handleCreateChild} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="ПІБ"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          required
        >
          <option value="">-- Виберіть групу --</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>
        <button type="submit">Додати</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ПІБ</th>
            <th>Дата нар.</th>
            <th>Група</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {children.map((child) => (
            <tr key={child._id}>
              <td>{child.fullName}</td>
              <td>{child.birthDate.split("T")[0]}</td>
              <td>{child.group?.name || "—"}</td>
              <td>
                <button onClick={() => handleDelete(child._id)}>
                  🗑 Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChildrenManagementPage;
