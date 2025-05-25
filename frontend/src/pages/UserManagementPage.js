import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Table, Button, Alert, Form } from "react-bootstrap";

const UserManagementPage = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError("Помилка при завантаженні користувачів");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити користувача?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Не вдалося видалити");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/users/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      alert("Не вдалося змінити роль");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container className="py-4">
      <Card style={{ backgroundColor: "#fffbea" }}>
        <Card.Body>
          <Card.Title style={{ color: "#6f42c1" }}>Користувачі</Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}

          <Table bordered hover responsive className="mt-3">
            <thead style={{ backgroundColor: "#f8d7da" }}>
              <tr>
                <th>Email</th>
                <th>Роль</th>
                <th>Змінити роль</th>
                <th>Видалити</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    >
                      <option value="admin">admin</option>
                      <option value="teacher">teacher</option>
                      <option value="parent">parent</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(u._id)}
                    >
                      🗑 Видалити
                    </Button>
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

export default UserManagementPage;
