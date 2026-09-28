import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isStudent, isInstructor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎓 LearnHub
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              {isStudent && (
                <>
                  <Link to="/courses">Available Courses</Link>
                  <Link to="/my-courses">My Courses</Link>
                  <Link to="/ai-recommendation" className="ai-link">
                    ✨ AI Assistant
                  </Link>
                </>
              )}

              {isInstructor && (
                <>
                  <Link to="/instructor">Instructor Dashboard</Link>
                  <Link to="/instructor/courses/create">+ Create Course</Link>
                </>
              )}

              <div className="user-section">
                <span className="user-badge">
                  {user.name} ({user.role})
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-btn">
                Login
              </Link>
              <Link to="/register" className="nav-btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
