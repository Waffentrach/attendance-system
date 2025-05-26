// src/pages/ParentAttendance.js
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Table, Form } from "react-bootstrap";

const ParentAttendance = () => {
  const { token } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/attendance/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data);
    } catch (err) {
      console.error("Помилка при завантаженні журналу:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Журнал відвідуваності</h2>

      <Form.Group className="mb-3" controlId="dateFilter">
        <Form.Label>Фільтр за датою</Form.Label>
        <Form.Control
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </Form.Group>

      <Table bordered hover responsive>
        <thead className="table-light">
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
                  {rec.children
                    .map(
                      (c) =>
                        `${c.child?.fullName}${
                          c.reason ? ` (відсутній: ${c.reason})` : ""
                        }`
                    )
                    .join(", ")}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ParentAttendance;
