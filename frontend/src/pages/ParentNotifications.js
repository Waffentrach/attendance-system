// src/pages/ParentNotifications.js
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, ListGroup } from "react-bootstrap";

const ParentNotifications = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Помилка при завантаженні повідомлень:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Повідомлення від вихователів</h2>
      {notifications.length === 0 ? (
        <p>Повідомлень поки що немає.</p>
      ) : (
        <ListGroup>
          {notifications.map((n) => (
            <ListGroup.Item key={n._id}>
              <strong>{n.date?.split("T")[0]}:</strong> {n.message}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default ParentNotifications;
