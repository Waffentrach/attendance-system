import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const AdminNavbar = ({ active }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="md" className="mb-4 shadow-sm sticky-top">
      <Container>
        <Navbar.Brand className="fw-bold">
          Адмін-панель
          <div className="text-muted small">Вітаємо, admin@example.com</div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar" />
        <Navbar.Collapse id="admin-navbar">
          <Nav className="ms-auto d-flex flex-wrap gap-2">
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
              variant={
                active === "children" ? "secondary" : "outline-secondary"
              }
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
