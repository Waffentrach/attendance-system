import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Form,
  Button,
  Table,
  Row,
  Col,
  Card,
} from "react-bootstrap";

const ChildrenManagementPage = () => {
  const { token } = useContext(AuthContext);
  const [children, setChildren] = useState([]);
  const [groups, setGroups] = useState([]);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [groupId, setGroupId] = useState("");
  const [parents, setParents] = useState([]);

  const fetchChildren = async () => {
    const res = await axios.get("http://localhost:5000/api/children", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChildren(res.data);
  };

  const fetchGroups = async () => {
    const res = await axios.get("http://localhost:5000/api/groups", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGroups(res.data);
  };

  const handleCreateChild = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/children",
        { fullName, birthDate, groupId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFullName("");
      setBirthDate("");
      setGroupId("");
      fetchChildren();
    } catch (err) {
      alert("Не вдалося створити дитину");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити дитину?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/children/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChildren(children.filter((c) => c._id !== id));
    } catch (err) {
      alert("Помилка при видаленні");
    }
  };
  const fetchParents = async () => {
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setParents(res.data.filter((u) => u.role === "parent"));
  };
  const handleAssignParent = async (childId, parentId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/children/${childId}/assign-parent`,
        { parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchChildren(); // оновлює список після зміни
    } catch (err) {
      alert("Не вдалося призначити батька");
    }
  };

  useEffect(() => {
    fetchChildren();
    fetchGroups();
    fetchParents();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Управління дітьми</h2>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleCreateChild}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="ПІБ дитини"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  required
                >
                  <option value="">-- Виберіть групу --</option>
                  {groups.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button type="submit" variant="warning" className="w-100">
                  ➕ Додати
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>ПІБ</th>
                <th>Дата нар.</th>
                <th>Група</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {children.map((child) => (
                <tr key={child._id}>
                  <td>{child.fullName}</td>
                  <td>{child.birthDate.split("T")[0]}</td>
                  <td>{child.group?.name || "—"}</td>
                  <td>
                    <select
                      value={child.parent?._id || ""}
                      onChange={(e) =>
                        handleAssignParent(child._id, e.target.value)
                      }
                    >
                      <option value="">-- Обрати батька --</option>
                      {parents.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.email}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(child._id)}
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

export default ChildrenManagementPage;
