import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Container, Row, Col, Nav } from "react-bootstrap";

const TeacherEventsPage = () => {
  const { token, logout } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5000/api/events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEvents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    await axios.post(
      "http://localhost:5000/api/events",
      { title, message: description, date },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTitle("");
    setDescription("");
    setDate("");
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Container className="py-4">
      {/* 🔁 Верхня навігація */}
      <Row className="align-items-center mb-3">
        <Col>
          <Nav variant="tabs" defaultActiveKey="/teacher/events">
            <Nav.Item>
              <Nav.Link onClick={() => navigate("/journal")}>
                📔 Журнал
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active>🎉 Події</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col className="text-end">
          <Button
            variant="danger"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            🚪 Вийти
          </Button>
        </Col>
      </Row>

      {/* 📝 Форма додавання події */}
      <Card className="p-3 shadow-sm">
        <h4>🎉 Події для батьків</h4>
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-2">
            <Form.Label>Назва події</Form.Label>
            <Form.Control
              type="text"
              placeholder="Наприклад, Святковий концерт"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Опис</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Опис події"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Дата</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="success">
            ➕ Додати подію
          </Button>
        </Form>
      </Card>

      {/* 📅 Список подій */}
      <Card className="mt-4 p-3 shadow-sm">
        <h5>🗂 Заплановані події:</h5>
        {events.map((e) => (
          <Card key={e._id} className="my-2 bg-light">
            <Card.Body>
              <strong>
                {e.date?.split("T")[0]} — {e.title}
              </strong>
              <p className="mb-0">{e.message}</p>
            </Card.Body>
          </Card>
        ))}
      </Card>
    </Container>
  );
};

export default TeacherEventsPage;
