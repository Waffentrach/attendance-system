import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ParentDashboardPage = () => {
  const { token, user } = useContext(AuthContext);
  const [children, setChildren] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [notifications, setNotifications] = useState([]);

  const fetchChildren = async () => {
    const res = await axios.get("http://localhost:5000/api/children/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChildren(res.data);
  };
  const fetchNotifications = async () => {
    const res = await axios.get("http://localhost:5000/api/notifications/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(res.data);
  };

  const fetchAttendance = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/attendance/my/parent",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setAttendance(res.data);
  };

  useEffect(() => {
    fetchChildren();
    fetchAttendance();
    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Кабінет батьків</h2>
      <p>Вітаємо, {user.email}</p>

      <h3>Діти</h3>
      {children.map((child) => (
        <div key={child._id} style={{ marginBottom: "1rem" }}>
          <strong>{child.fullName}</strong>
          <br />
          Дата народження: {child.birthDate?.split("T")[0]}
          <br />
          Група: {child.group?.name || "—"}
        </div>
      ))}
      <label>Фільтр за датою: </label>
      <input
        type="date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
      />
      <h3>Повідомлення від вихователя</h3>
      <ul>
        {notifications.map((n) => (
          <li key={n._id}>
            {n.date?.split("T")[0]} — {n.message}
          </li>
        ))}
      </ul>

      <h3>Журнал відвідуваності</h3>

      <h3>Журнал відвідуваності</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Група</th>
            <th>Присутні діти</th>
          </tr>
        </thead>
        <tbody>
          {attendance
            .filter((rec) => !dateFilter || rec.date.startsWith(dateFilter))
            .map((rec) => (
              <tr key={rec._id}>
                <td>{rec.date.split("T")[0]}</td>
                <td>{rec.group?.name || "—"}</td>
                <td>
                  {rec.children
                    .map(
                      (c) =>
                        `${c.child?.fullName}${
                          c.reason ? ` (відсутній: ${c.reason})` : ""
                        }`
                    )
                    .join(", ")}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParentDashboardPage;
