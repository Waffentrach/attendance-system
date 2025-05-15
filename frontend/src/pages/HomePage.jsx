import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleNavigate = (path) => navigate(path);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Інформаційна система обліку відвідування ДНЗ</h1>

      {!token ? (
        <>
          <p style={styles.subtitle}>
            Для продовження, будь ласка, увійдіть або зареєструйтесь.
          </p>
          <div style={styles.buttonGroup}>
            <button onClick={() => handleNavigate("/login")} style={styles.button}>
              🔐 Увійти
            </button>
            <button onClick={() => handleNavigate("/register")} style={styles.button}>
              📝 Зареєструватися
            </button>
          </div>
        </>
      ) : (
        <>
          <p style={styles.subtitle}>Вітаємо, {user.name}!</p>
          <p>Ваша роль: <strong>{user.role}</strong></p>
          <div style={styles.buttonGroup}>
            {user.role === "teacher" && (
              <button onClick={() => handleNavigate("/teacher")} style={styles.button}>
                📋 Перейти до журналу
              </button>
            )}
            {user.role === "admin" && (
              <>
                <button onClick={() => handleNavigate("/admin")} style={styles.button}>
                  📁 Керування групами
                </button>
                <button onClick={() => handleNavigate("/users")} style={styles.button}>
                  👤 Користувачі
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "700px",
    margin: "auto",
    textAlign: "center",
    background: "#fffef3",
    borderRadius: "12px",
    fontFamily: "sans-serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "1.5rem",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  button: {
    padding: "0.7rem 1.5rem",
    borderRadius: "8px",
    background: "#fff3b0",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    minWidth: "150px",
  },
};

export default HomePage;
