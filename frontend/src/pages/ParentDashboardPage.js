import { useState, useContext } from "react";
import { Tabs, Tab, Container, Button, Row, Col } from "react-bootstrap";
import ParentChildren from "./ParentChildren";
import ParentNotifications from "./ParentNotifications";
import ParentAttendance from "./ParentAttendance";
import ParentEvents from "./ParentEvents";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ParentDashboardPage = () => {
  const [key, setKey] = useState("children");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h2 className="text-center">👨‍👩‍👧 Кабінет батьків</h2>
        </Col>
        <Col xs="auto">
          <Button variant="danger" onClick={handleLogout}>
            🚪 Вийти
          </Button>
        </Col>
      </Row>

      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        justify
      >
        <Tab eventKey="children" title="👧 Діти">
          <ParentChildren />
        </Tab>
        <Tab eventKey="notifications" title="📩 Повідомлення">
          <ParentNotifications />
        </Tab>
        <Tab eventKey="attendance" title="📅 Відвідуваність">
          <ParentAttendance />
        </Tab>
        <Tab eventKey="events" title="🎉 Події">
          <ParentEvents />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ParentDashboardPage;
