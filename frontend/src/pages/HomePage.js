import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

  return <h1>Завантаження...</h1>;
};

export default HomePage;
