import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const UserManagementPage = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError("Помилка при завантаженні користувачів");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити користувача?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Не вдалося видалити");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/users/${id}`,
        {
          role: newRole,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      alert("Не вдалося змінити роль");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Користувачі</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Email</th>
            <th>Роль</th>
            <th>Змінити роль</th>
            <th>Видалити</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                >
                  <option value="admin">admin</option>
                  <option value="teacher">teacher</option>
                  <option value="parent">parent</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(u._id)}>🗑 Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementPage;
