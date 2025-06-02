import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Table,
  Row,
  Col,
  Alert,
  Nav,
} from "react-bootstrap";

const TeacherJournalPage = () => {
  const { token, logout } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [children, setChildren] = useState([]);
  const [date, setDate] = useState("");
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const fetchRecords = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/attendance/my/teacher",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setRecords(res.data);
  };

  const fetchChildren = async () => {
    const res = await axios.get("http://localhost:5000/api/groups/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const group = res.data;
    if (group && group.children) {
      setChildren(group.children);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const groupRes = await axios.get("http://localhost:5000/api/groups/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.post(
        "http://localhost:5000/api/attendance",
        {
          date,
          groupId: groupRes.data._id,
          childrenIds: selectedChildren,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDate("");
      setSelectedChildren([]);
      setSuccess("Запис збережено успішно!");
      fetchRecords();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Помилка при створенні запису");
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchRecords();
    fetchChildren();
  }, []);

  return (
    <Container className="py-4">
      
      <Row className="align-items-center mb-3">
        <Col>
          <Nav variant="tabs" defaultActiveKey="/journal">
            <Nav.Item>
              <Nav.Link active onClick={() => navigate("/journal")}>
                Журнал
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => navigate("/teacher/events")}>
                Події
              </Nav.Link>
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

      {/* 📋 Журнал */}
      <Card style={{ backgroundColor: "#fff0f5" }}>
        <Card.Body>
          <Card.Title style={{ color: "#6f42c1" }}>Мій журнал</Card.Title>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Дата</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Присутні діти</Form.Label>
              <div
                className="mb-2"
                style={{ maxHeight: 200, overflowY: "auto" }}
              >
                {children.map((child) => (
                  <Form.Check
                    key={child._id}
                    type="checkbox"
                    label={child.fullName}
                    checked={selectedChildren.includes(child._id)}
                    onChange={() => handleCheckboxChange(child._id)}
                  />
                ))}
              </div>
            </Form.Group>

            <Row>
              <Col>
                <Button variant="warning" type="submit">
                  Зберегти
                </Button>
                <Button
                  variant="outline-primary"
                  className="ms-3"
                  onClick={() => navigate("/teacher/notify")}
                >
                  Надіслати повідомлення
                </Button>
              </Col>
            </Row>
          </Form>

          {success && (
            <Alert variant="success" className="mt-3">
              {success}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* 📚 Історія */}
      <Card className="mt-4" style={{ backgroundColor: "#fdfde3" }}>
        <Card.Body>
          <Card.Title style={{ color: "#d63384" }}>Історія</Card.Title>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Діти</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td>{r.date.split("T")[0]}</td>
                  <td>
                    {r.children.length > 0
                      ? r.children.map((c) => c.child?.fullName).join(", ")
                      : "немає"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TeacherJournalPage;
