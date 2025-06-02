import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("parent");
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmail("");
      setPassword("");
      setRole("parent");
      setError("");
    } catch {
      setError("Помилка при створенні користувача");
    }
  };

  return (
    <Container className="py-4">
      <AdminNavbar active="register" />

      <Card className="p-4 shadow-sm border-0">
        <h5 className="mb-3">Додати нового користувача</h5>

        <Form onSubmit={handleCreate}>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Пароль:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Роль:</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="parent">Батько</option>
              <option value="teacher">Вихователь</option>
              <option value="admin">Адмін</option>
            </Form.Select>
          </Form.Group>

          <Button variant="success" type="submit">
            Створити
          </Button>
        </Form>

        {error && <p className="text-danger mt-3">{error}</p>}
      </Card>
    </Container>
  );
};

export default AdminDashboard;
