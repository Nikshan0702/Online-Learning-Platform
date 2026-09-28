import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';
import MyCourses from './pages/MyCourses';
import AiRecommendation from './pages/AiRecommendation';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import EnrolledStudents from './pages/instructor/EnrolledStudents';

// Root redirect handler
const RootRedirect = () => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  return user.role === 'instructor' ? (
    <Navigate to="/instructor" replace />
  ) : (
    <Navigate to="/courses" replace />
  );
};

function AppContent() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student & Authenticated Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'instructor']} />}>
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
          </Route>

          {/* Student-only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/ai-recommendation" element={<AiRecommendation />} />
          </Route>

          {/* Instructor-only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/courses/create" element={<CreateCourse />} />
            <Route path="/instructor/courses/:id/edit" element={<EditCourse />} />
            <Route path="/instructor/courses/:id/students" element={<EnrolledStudents />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
