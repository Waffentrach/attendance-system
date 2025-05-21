import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    }
    if (user?.role === "teacher") {
      // Тут буде сторінка вихователя (згодом)
      navigate("/journal");
    }
  }, [user, navigate]);

  return <p>Завантаження...</p>; // тимчасово
};

export default HomePage;
