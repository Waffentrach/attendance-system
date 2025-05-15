import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "teacher",
  });
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Не вдалося завантажити користувачів", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Заповніть усі поля");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        newUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Користувача створено ✅");
      setNewUser({ name: "", email: "", password: "", role: "teacher" });
      fetchUsers();
    } catch (err) {
      alert("Помилка створення ❌");
      console.error(err.response?.data || err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цього користувача?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Користувача видалено ✅");
      fetchUsers();
    } catch (err) {
      alert("Помилка видалення ❌");
      console.error(err.response?.data || err.message);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (err) {
      alert("Помилка зміни ролі ❌");
      console.error(err.response?.data || err.message);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", background: "#fefefe" }}>
      <h2 style={styles.title}>Керування користувачами</h2>

      <input
        type="text"
        placeholder="🔎 Пошук по імені або email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      <div style={styles.section}>
        <h3>Створити нового користувача</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Ім’я"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            style={styles.input}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={styles.select}
          >
            <option value="teacher">Вихователь</option>
            <option value="admin">Адміністратор</option>
          </select>
          <button style={styles.button} onClick={handleCreateUser}>
            ➕ Створити
          </button>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Ім’я</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Роль</th>
            <th style={styles.th}>Змінити роль</th>
            <th style={styles.th}>Видалити</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>{user.role}</td>
              <td style={styles.td}>
                <select
                  value={user.role}
                  onChange={(e) => handleChangeRole(user._id, e.target.value)}
                  style={styles.selectSmall}
                >
                  <option value="teacher">Вихователь</option>
                  <option value="admin">Адміністратор</option>
                </select>
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => handleDelete(user._id)}
                  style={styles.deleteButton}
                >
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

const styles = {
  title: {
    fontSize: "1.8rem",
    marginBottom: "1.2rem",
    color: "#333",
  },
  section: {
    background: "#fffef5",
    padding: "1.5rem",
    borderRadius: "10px",
    marginBottom: "2rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  input: {
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    maxWidth: "200px",
    fontSize: "1rem",
  },
  select: {
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    background: "#fff7c2",
  },
  selectSmall: {
    padding: "0.3rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
    background: "#f9f9f9",
  },
  button: {
    background: "#fff7c2",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  deleteButton: {
    background: "#ffe5e5",
    border: "1px solid #ff9999",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    color: "#d10000",
    fontWeight: "bold",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    background: "#ffffff",
  },
  th: {
    background: "#f5f2eb",
    padding: "0.8rem",
    textAlign: "left",
    borderBottom: "1px solid #ccc",
  },
  td: {
    padding: "0.8rem",
    borderBottom: "1px solid #eee",
  },
};

export default UserManagement;
