import { useNavigate } from "react-router-dom";
import { Button, Nav } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminNavbar = ({ active }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-between align-items-center bg-white p-3 mb-4 rounded shadow-sm sticky-top">
      <div>
        <h5 className="mb-1">Адмін-панель</h5>
        <small className="text-muted">Вітаємо, admin@example.com</small>
      </div>
      <div className="d-flex align-items-center gap-2">
        <Button
          variant={active === "register" ? "success" : "outline-secondary"}
          onClick={() => navigate("/admin/register")}
        >
          🆕 Реєстрація
        </Button>
        <Button
          variant={active === "users" ? "warning" : "outline-secondary"}
          onClick={() => navigate("/admin/users")}
        >
          👤 Користувачі
        </Button>
        <Button
          variant={active === "groups" ? "info" : "outline-secondary"}
          onClick={() => navigate("/admin/groups")}
        >
          🧑‍🤝‍🧑 Групи
        </Button>
        <Button
          variant={active === "children" ? "secondary" : "outline-secondary"}
          onClick={() => navigate("/admin/children")}
        >
          👶 Діти
        </Button>
        <Button
          variant={active === "attendance" ? "danger" : "outline-secondary"}
          onClick={() => navigate("/admin/attendance")}
        >
          📖 Журнал
        </Button>
        <Button variant="outline-dark" onClick={handleLogout}>
          📜 Вийти
        </Button>
      </div>
    </div>
  );
};

export default AdminNavbar;
