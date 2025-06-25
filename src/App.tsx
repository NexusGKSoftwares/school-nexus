import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"

// Public Pages
import Landing from "./pages/Landing"
import Home from "./pages/Home"

// Auth Pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"

// Student Pages
import StudentLayout from "./layouts/StudentLayout"
import StudentDashboard from "./pages/student/Dashboard"
import TimeSchedule from "./pages/student/TimeSchedule"
import Notifications from "./pages/student/Notifications"
import Messages from "./pages/student/Messages"
import LearningPlan from "./pages/student/LearningPlan"
import Help from "./pages/student/Help"
import Contact from "./pages/student/Contact"

// Lecturer Pages
import LecturerLayout from "./layouts/LecturerLayout"
import LecturerDashboard from "./pages/lecturer/Dashboard"

// Admin Pages
import AdminLayout from "./layouts/AdminLayout"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminStudents from "./pages/admin/Students"

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* Protected Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute requiredUserType="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="schedule" element={<TimeSchedule />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="messages" element={<Messages />} />
          <Route path="learning-plan" element={<LearningPlan />} />
          <Route path="help" element={<Help />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Protected Lecturer Routes */}
        <Route
          path="/lecturer"
          element={
            <ProtectedRoute requiredUserType="lecturer">
              <LecturerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LecturerDashboard />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredUserType="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
