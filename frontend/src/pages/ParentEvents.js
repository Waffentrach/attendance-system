// src/pages/ParentEvents.js
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Row, Col } from "react-bootstrap";

const ParentEvents = () => {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Помилка при завантаженні подій:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Події</h2>
      <Row>
        {events.length === 0 ? (
          <p>Подій поки що немає.</p>
        ) : (
          events.map((event) => (
            <Col md={6} key={event._id} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {event.date?.split("T")[0]}
                  </Card.Subtitle>
                  <Card.Text>{event.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default ParentEvents;
