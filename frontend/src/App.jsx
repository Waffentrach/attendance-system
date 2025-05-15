import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import UserManagement from "./pages/UserManagement";
import HomePage from "./pages/HomePage";
import AdminLayout from "./components/AdminLayout"; 
import GroupList from "./pages/GroupList";
function App() {
  return (
    <Router>
      <Routes>
        {/* Публічні маршрути */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Панель адміністратора з layout  */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="groups" element={<GroupList />} />
        </Route>

       

        {/* Панель вихователя */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
