import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const role = user.role;
    if (role === "admin") navigate("/admin", { replace: true });
    else if (role === "teacher") navigate("/journal", { replace: true });
    else if (role === "parent") navigate("/parent", { replace: true });
  }, [user, navigate]);

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="text-center">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-3">Завантаження...</p>
      </div>
    </Container>
  );
};

export default HomePage;
