import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Table, Button, Row, Col, Card } from "react-bootstrap";
import AdminNavbar from "../pages/AdminNavbar";

const AttendanceManagementPage = () => {
  const { token } = useContext(AuthContext);
  const [records, setRecords] = useState([]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      alert("Помилка при завантаженні журналу");
    }
  };

  const exportCSV = () => {
    window.open(
      `http://localhost:5000/api/attendance/export/csv?token=${token}`,
      `_blank`
    );
  };

  const exportPDF = () => {
    window.open(
      `http://localhost:5000/api/attendance/export/pdf?token=${token}`,
      `_blank`
    );
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <Container className="py-4">
      <AdminNavbar active="attendance" />
      <h2 className="text-center mb-4">Журнал відвідуваності</h2>

      <Row className="mb-3">
        <Col md="auto">
          <Button variant="warning" onClick={exportCSV}>
            ⬇️ Експорт у CSV
          </Button>
        </Col>
        <Col md="auto">
          <Button variant="info" onClick={exportPDF}>
            📄 Експорт у PDF
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Дата</th>
                <th>Група</th>
                <th>Діти</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td>{r.date.split("T")[0]}</td>
                  <td>{r.group?.name || "—"}</td>
                  <td>
                    {r.children.length > 0
                      ? r.children
                          .map((c) => c.child?.fullName || "—")
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

export default AttendanceManagementPage;
