import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Card } from "react-bootstrap";

const AdminAddUser = () => {
  const { token } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("parent");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, password, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Користувача створено успішно!");
      setEmail("");
      setPassword("");
      setRole("parent");
    } catch (err) {
      setError("Помилка при створенні користувача");
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <h5 className="mb-3">Додати нового користувача</h5>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Пароль:</Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Роль:</Form.Label>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Адмін</option>
            <option value="teacher">Вихователь</option>
            <option value="parent">Батько</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="success">
          Створити
        </Button>
      </Form>

      {success && <p className="text-success mt-3">{success}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}
    </Card>
  );
};

export default AdminAddUser;
