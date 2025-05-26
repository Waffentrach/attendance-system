// src/pages/ParentChildren.js
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Card } from "react-bootstrap";

const ParentChildren = () => {
  const { token } = useContext(AuthContext);
  const [children, setChildren] = useState([]);

  const fetchChildren = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/children/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChildren(res.data);
    } catch (err) {
      console.error("Помилка при завантаженні дітей:", err);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Мої діти</h2>
      {children.length === 0 && <p>Немає привʼязаних дітей</p>}
      {children.map((child) => (
        <Card className="mb-3" key={child._id}>
          <Card.Body>
            <Card.Title>{child.fullName}</Card.Title>
            <Card.Text>
              <strong>Дата народження:</strong> {child.birthDate?.split("T")[0]}{" "}
              <br />
              <strong>Група:</strong> {child.group?.name || "—"}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default ParentChildren;
