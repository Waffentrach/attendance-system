import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [newGroup, setNewGroup] = useState({ name: "", description: "", teacherId: "" });
  const [newChild, setNewChild] = useState({
    name: "",
    birthDate: "",
    groupId: ""
  });
  const [teachers, setTeachers] = useState([]);
  const token = localStorage.getItem("token");

  // Завантаження груп
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/groups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data);
      } catch (err) {
        console.error("Не вдалося завантажити групи", err);
      }
    };

    fetchGroups();
  }, [token]);

  // Завантаження викладачів
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users?role=teacher", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(res.data);
      } catch (err) {
        console.error("Не вдалося завантажити викладачів", err);
      }
    };

    fetchTeachers();
  }, [token]);

  // Отримати історію по групі
  const fetchGroupAttendance = async (groupId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttendance((prev) => ({
        ...prev,
        [groupId]: res.data,
      }));
    } catch (err) {
      console.error("Помилка завантаження журналу", err);
    }
  };
  const handleAddChild = async () => {
    if (!newChild.name || !newChild.birthDate || !newChild.groupId) {
      alert("Заповніть усі поля");
      return;
    }
  
    try {
      await axios.post(
        "http://localhost:5000/api/children",
        {
          name: newChild.name,
          birthDate: newChild.birthDate,
          group: newChild.groupId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert("Дитину додано ✅");
      setNewChild({ name: "", birthDate: "", groupId: "" });
  
      // Оновити групи після додавання
      const updated = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(updated.data);
    } catch (err) {
      alert("Помилка додавання дитини ❌");
      console.error(err.response?.data || err.message);
    }
  };
  // Створити нову групу
  const handleCreateGroup = async () => {
    if (!newGroup.name || !newGroup.description || !newGroup.teacherId) {
      alert("Заповніть усі поля");
      return;
    }

    try {
      // Створити групу
      const res = await axios.post(
        "http://localhost:5000/api/groups",
        {
          name: newGroup.name,
          description: newGroup.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const groupId = res.data._id;

      // Призначити викладача
      await axios.put(
        `http://localhost:5000/api/groups/${groupId}/assign-teacher`,
        { teacherId: newGroup.teacherId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Групу створено і викладача призначено ✅");

      // Оновити список груп
      const updatedGroups = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(updatedGroups.data);

      
      // Очистити форму
      setNewGroup({ name: "", description: "", teacherId: "" });
    } catch (err) {
      alert("Помилка створення групи");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={styles.title}>Панель адміністратора — Групи</h2>

      <h3>Створити нову групу</h3>
      <div style={{ marginBottom: "1rem" }}>
        <input style={styles.input}
          type="text"
          placeholder="Назва групи"
          value={newGroup.name}
          onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
        />
        <br />
        <input
          type="text"
          placeholder="Опис"
          value={newGroup.description}
          onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
        />
        <br />
        <select style={styles.select}
          value={newGroup.teacherId}
          onChange={(e) => setNewGroup({ ...newGroup, teacherId: e.target.value })}
        >
          <option value="">Оберіть викладача</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.name} ({teacher.email})
            </option>
          ))}
        </select>
        <br />
        <button style={styles.button} onClick={handleCreateGroup}>Створити групу</button>
      </div>

      <hr />

      {groups.length === 0 ? (
        <p>Немає груп</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
            <th style={styles.th}>Назва</th>
      <th style={styles.th}>Опис</th>
      <th style={styles.th}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group._id}>
                <td style={styles.td}>{group.name}</td>
                <td style={styles.td}>{group.description}</td>
                <td style={styles.td}>
                  <button style={styles.smallButton} onClick={() => fetchGroupAttendance(group._id)}>
                    Переглянути журнал
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />
      <h3>Додати дитину до групи</h3>
<div style={{ marginBottom: "1rem" }}>
  <input
    type="text"
    placeholder="Ім’я дитини"
    value={newChild.name}
    onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
  />
  <br />
  <input
    type="date"
    value={newChild.birthDate}
    onChange={(e) => setNewChild({ ...newChild, birthDate: e.target.value })}
  />
  <br />
  <select
    value={newChild.groupId}
    onChange={(e) => setNewChild({ ...newChild, groupId: e.target.value })}
  >
    <option value="">Оберіть групу</option>
    {groups.map((g) => (
      <option key={g._id} value={g._id}>
        {g.name}
      </option>
    ))}
  </select>
  <br />
  <button onClick={handleAddChild}>Додати дитину</button>
</div>
<h3>Статистика відвідуваності</h3>
{Object.keys(attendance).map((groupId) => {
  const group = groups.find((g) => g._id === groupId);
  const allRecords = attendance[groupId] || [];

  const stats = {};

  allRecords.forEach((entry) => {
    entry.records.forEach((r) => {
      const id = r.child._id;
      if (!stats[id]) {
        stats[id] = {
          name: r.child.name,
          present: 0,
          total: 0
        };
      }
      if (r.present) stats[id].present += 1;
      stats[id].total += 1;
    });
  });

  return (
    <div key={groupId} style={{ marginBottom: "2rem" }}>
      <h4>Група: {group?.name}</h4>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th style={styles.th}>Ім’я дитини</th>
            <th style={styles.th}>Присутній (днів)</th>
            <th style={styles.th}>Всього записів</th>
            <th style={styles.th}>% відвідуваності</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(stats).map((child) => (
            <tr key={child.name}>
              <td style={styles.td}м>{child.name}</td>
              <td style={styles.td}>{child.present}</td>
              <td style={styles.td}>{child.total}</td>
              <td style={styles.td}> 
                {child.total === 0
                  ? "—"
                  : Math.round((child.present / child.total) * 100) + "%"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
})}

      <h3>Журнали відвідуваності</h3>
      {Object.keys(attendance).map((groupId) => (
        <div key={groupId}>
          <h4>Група: {groups.find((g) => g._id === groupId)?.name}</h4>
          {attendance[groupId].length === 0 ? (
            <p>Немає записів</p>
          ) : (
            attendance[groupId].map((entry) => (
              <div key={entry._id} style={{ marginBottom: "1rem" }}>
                <strong>
                  {new Date(entry.date).toLocaleDateString("uk-UA")}
                </strong>
                <ul>
                  {entry.records.map((r) => (
                    <li key={r.child._id}>
                      {r.child.name} — {r.present ? "✅ Присутній" : "❌ Відсутній"}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>


        
      ))}
    </div>
  );
};

const styles = {
  section: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "2rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  input: {
    width: "100%",
    padding: "0.6rem",
    marginBottom: "0.8rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f5f2eb",
  },
  select: {
    width: "100%",
    padding: "0.6rem",
    marginBottom: "0.8rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#fff7c2",
  },
  button: {
    background: "#fff7c2",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
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
  title: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
    color: "#2e2e2e",
  },
  smallButton: {
    background: "#f0f0f0",
    border: "1px solid #aaa",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
};


export default AdminDashboard;
