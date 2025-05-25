import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import UserManagementPage from "./pages/UserManagementPage";
import GroupManagementPage from "./pages/GroupManagementPage";
import ChildrenManagementPage from "./pages/ChildrenManagementPage";
import AttendanceManagementPage from "./pages/AttendanceManagementPage";
import TeacherJournalPage from "./pages/TeacherJournalPage";
import ParentDashboardPage from "./pages/ParentDashboardPage";
import SendNotificationPage from "./pages/SendNotificationPage";

<button className="btn btn-primary">Перевірка Bootstrap</button>;
function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin/users"
          element={
            user?.role === "admin" ? (
              <UserManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/groups"
          element={
            user?.role === "admin" ? (
              <GroupManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/children"
          element={
            user?.role === "admin" ? (
              <ChildrenManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/attendance"
          element={
            user?.role === "admin" ? (
              <AttendanceManagementPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/parent"
          element={
            user?.role === "parent" ? (
              <ParentDashboardPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/teacher/notify"
          element={
            user?.role === "teacher" ? (
              <SendNotificationPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* teacher routes will go here */}
        <Route
          path="/journal"
          element={
            user?.role === "teacher" ? (
              <TeacherJournalPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
