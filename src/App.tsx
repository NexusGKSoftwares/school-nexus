import { Routes, Route } from "react-router-dom"
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
import LecturerProfile from "./pages/lecturer/Profile"
import LecturerAssignments from "./pages/lecturer/Assignments"
import LecturerAttendance from "./pages/lecturer/Attendance"
import LecturerCourses from "./pages/lecturer/Courses"
import LecturerGrading from "./pages/lecturer/Grading"
import LecturerMaterials from "./pages/lecturer/Materials"
import LecturerQuizzes from "./pages/lecturer/Quizzes"
import LecturerReports from "./pages/lecturer/Reports"
// Admin Pages
import AdminLayout from "./layouts/AdminLayout"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminStudents from "./pages/admin/Students"
import AdminLecturers from "./pages/admin/Lecturers"
import AdminStaff from "./pages/admin/Staff"
import AdminFaculties from "./pages/admin/Faculties"
import AdminCourses from "./pages/admin/Courses"
import AdminCalendar from "./pages/admin/Calendar"
import AdminRegistrations from "./pages/admin/Registrations"
import AdminTuition from "./pages/admin/Tuition"
import AdminPayments from "./pages/admin/Payments"
import AdminScholarships from "./pages/admin/Scholarships"
import AdminRefunds from "./pages/admin/Refunds"
import AdminSettings from "./pages/admin/Settings"
import AdminSupport from "./pages/admin/Support"
import AdminExams from "./pages/admin/Exams"
import AdminAnnouncements from "./pages/admin/Announcements"


function App() {
  return (
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
        <Route path="profile" element={<LecturerProfile />} />
        <Route path="courses" element={<LecturerCourses />} />
        <Route path="attendance" element={<LecturerAttendance />} />
        <Route path="materials" element={<LecturerMaterials />} />
        <Route path="assignments" element={<LecturerAssignments />} />
        <Route path="quizzes" element={<LecturerQuizzes />} />
        <Route path="grading" element={<LecturerGrading />} />
        {/* <Route path="announcements" element={<LecturerAnnouncements />} /> */}
        {/* <Route path="messages" element={<LecturerMessages />} /> */}
        <Route path="reports" element={<LecturerReports />} />
        {/* <Route path="settings" element={<LecturerSettings />} /> */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />

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
        <Route path="lecturers" element={<AdminLecturers />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="faculties" element={<AdminFaculties />} />
        <Route path="courses" element={< AdminCourses />} />
        <Route path="calendar" element={< AdminCalendar />} />
        <Route path="registrations" element={<AdminRegistrations />} />
        <Route path="tuition" element={<AdminTuition />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="scholarships" element={<AdminScholarships />} />
        <Route path="refunds" element={<AdminRefunds />} />
        <Route path="enrollment-reports" element={<div>Reports Page</div>} />
        <Route path="financial-reports" element={<div>Reports Page</div>} />
        <Route path="performance" element={<div>Reports Page</div>} />
        <Route path="attendance" element={<div>Reports Page</div>} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="support" element={<AdminSupport />} />
        {/* Add more admin routes as needed */}
      </Route>
    </Routes>
  )
}

export default App
