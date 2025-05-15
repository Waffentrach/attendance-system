import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif", background: "#f5f2eb" }}>
      {/* Бічне меню */}
      <aside style={{
        width: "250px",
        background: "#2e2e2e",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1rem"
      }}>
        <h2 style={{ color: "#fff7c2", fontSize: "1.5rem", marginBottom: "2rem" }}>
          Admin
        </h2>
        <Link to="/admin/dashboard" style={linkStyle}>📄 Групи та діти</Link>
        <Link to="/admin/users" style={linkStyle}>🧑‍🏫 Користувачі</Link>
        <Link to="/admin/statistics" style={linkStyle}>📊 Статистика</Link>
      </aside>

      {/* Контент */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2rem",
          borderBottom: "1px solid #ccc",
          paddingBottom: "0.5rem"
        }}>
          <h1 style={{ color: "#2e2e2e" }}>Система обліку відвідування ДНЗ</h1>
          <button style={{
            background: "#fff7c2",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer"
          }}>Вийти</button>
        </header>

        {/* Контент активного маршруту */}
        <Outlet />
      </main>
    </div>
  );
};

const linkStyle = {
  marginBottom: "1rem",
  textDecoration: "none",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.1rem"
};

export default AdminLayout;
