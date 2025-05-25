import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const SendNotificationPage = () => {
  const { token } = useContext(AuthContext);
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const fetchParents = async () => {
    const res = await axios.get("http://localhost:5000/api/users/parents", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setParents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParent || !message) return alert("Заповніть усі поля");

    try {
      await axios.post(
        "http://localhost:5000/api/notifications",
        { to: selectedParent, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Повідомлення надіслано успішно!");
      setMessage("");
      setSelectedParent("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      alert("Не вдалося надіслати повідомлення");
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  return (
    <Container className="py-4">
      <Card style={{ backgroundColor: "#fff9e6" }}>
        <Card.Body>
          <Card.Title style={{ color: "#6f42c1" }}>
            Надіслати повідомлення батькам
          </Card.Title>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Оберіть батька</Form.Label>
              <Form.Select
                value={selectedParent}
                onChange={(e) => setSelectedParent(e.target.value)}
                required
              >
                <option value="">-- Виберіть --</option>
                {parents.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Повідомлення</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Введіть текст повідомлення"
              />
            </Form.Group>

            <Button
              variant="warning"
              type="submit"
              style={{ backgroundColor: "#ffc107", color: "#000" }}
            >
              Надіслати
            </Button>
          </Form>

          {success && (
            <Alert variant="success" className="mt-3">
              {success}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SendNotificationPage;
