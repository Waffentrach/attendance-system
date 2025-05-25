import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Помилка при вході");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: "#fff7f1",
        }}
      >
        <h3 className="text-center mb-4" style={{ color: "#6f42c1" }}>
          Вхід
        </h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Електронна пошта</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введіть email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button
            variant="warning"
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#ffc107", borderColor: "#ffc107" }}
          >
            Увійти
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
