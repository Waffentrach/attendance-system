import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Адмін-панель</h2>
      <p>Вітаємо, {user.email}</p>

      <div style={{ marginTop: "1.5rem" }}>
        <button onClick={() => navigate("/admin/users")}>Користувачі</button>
        <button
          onClick={() => navigate("/admin/groups")}
          style={{ marginLeft: "1rem" }}
        >
          Групи
        </button>
        <button
          onClick={() => navigate("/admin/children")}
          style={{ marginLeft: "1rem" }}
        >
          Діти
        </button>
        <button
          onClick={() => navigate("/admin/attendance")}
          style={{ marginLeft: "1rem" }}
        >
          Журнал
        </button>
      </div>

      <button onClick={handleLogout} style={{ marginTop: "2rem" }}>
        Вийти
      </button>
    </div>
  );
};

export default AdminDashboard;
