import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Адмін-панель</h2>
      <Card className="p-4 shadow-sm border-0">
        <h5 className="mb-4">
          Вітаємо, <span className="text-primary">{user.email}</span>
        </h5>

        <Row className="g-3 mb-4">
          <Col md={6} lg={3}>
            <Button
              variant="warning"
              className="w-100"
              onClick={() => navigate("/admin/users")}
            >
              Користувачі
            </Button>
          </Col>
          <Col md={6} lg={3}>
            <Button
              variant="info"
              className="w-100"
              onClick={() => navigate("/admin/groups")}
            >
              Групи
            </Button>
          </Col>
          <Col md={6} lg={3}>
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => navigate("/admin/children")}
            >
              Діти
            </Button>
          </Col>
          <Col md={6} lg={3}>
            <Button
              variant="danger"
              className="w-100"
              onClick={() => navigate("/admin/attendance")}
            >
              Журнал
            </Button>
          </Col>
        </Row>

        <div className="text-center">
          <Button variant="outline-dark" onClick={handleLogout}>
            Вийти
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
