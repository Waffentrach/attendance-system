import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Card,
  Row,
  Col,
  Table,
  Form,
  ListGroup,
} from "react-bootstrap";

const ParentDashboardPage = () => {
  const { token, user } = useContext(AuthContext);
  const [children, setChildren] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [notifications, setNotifications] = useState([]);

  const fetchChildren = async () => {
    const res = await axios.get("http://localhost:5000/api/children/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChildren(res.data);
  };

  const fetchNotifications = async () => {
    const res = await axios.get("http://localhost:5000/api/notifications/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(res.data);
  };

  const fetchAttendance = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/attendance/my/parent",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setAttendance(res.data);
  };

  useEffect(() => {
    fetchChildren();
    fetchAttendance();
    fetchNotifications();
  }, []);

  return (
    <Container className="py-4">
      <Card className="mb-4" style={{ backgroundColor: "#fff6f0" }}>
        <Card.Body>
          <Card.Title style={{ color: "#6f42c1" }}>Кабінет батьків</Card.Title>
          <Card.Text>
            Вітаємо, <strong>{user.email}</strong>
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header style={{ backgroundColor: "#f3e5f5", color: "#6f42c1" }}>
          Діти
        </Card.Header>
        <Card.Body>
          <Row>
            {children.map((child) => (
              <Col key={child._id} md={6} className="mb-3">
                <Card style={{ backgroundColor: "#fff9e6" }}>
                  <Card.Body>
                    <Card.Title>{child.fullName}</Card.Title>
                    <Card.Text>
                      <strong>Дата нар.:</strong>{" "}
                      {child.birthDate?.split("T")[0]}
                      <br />
                      <strong>Група:</strong> {child.group?.name || "—"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header style={{ backgroundColor: "#fff0f5", color: "#c2185b" }}>
          Повідомлення від вихователя
        </Card.Header>
        <ListGroup variant="flush">
          {notifications.map((n) => (
            <ListGroup.Item key={n._id}>
              <strong>{n.date?.split("T")[0]}</strong>: {n.message}
            </ListGroup.Item>
          ))}
          {notifications.length === 0 && (
            <ListGroup.Item>Немає повідомлень</ListGroup.Item>
          )}
        </ListGroup>
      </Card>

      <Card>
        <Card.Header style={{ backgroundColor: "#f8e8ff", color: "#6f42c1" }}>
          Журнал відвідуваності
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Фільтр за датою</Form.Label>
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Form.Group>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Група</th>
                <th>Присутні діти</th>
              </tr>
            </thead>
            <tbody>
              {attendance
                .filter((rec) => !dateFilter || rec.date.startsWith(dateFilter))
                .map((rec) => (
                  <tr key={rec._id}>
                    <td>{rec.date.split("T")[0]}</td>
                    <td>{rec.group?.name || "—"}</td>
                    <td>
                      {rec.children.length > 0
                        ? rec.children
                            .map(
                              (c) =>
                                `${c.child?.fullName}${
                                  c.reason ? ` (відсутній: ${c.reason})` : ""
                                }`
                            )
                            .join(", ")
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

export default ParentDashboardPage;
