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
        <Link to="/" className="nav-logo">LearnHub</Link>

        <div className="nav-links">
          {user ? (
            <>
              {isStudent && (
                <>
                  <Link to="/courses">Courses</Link>
                  <Link to="/my-courses">My Courses</Link>
                  <Link to="/ai-recommendation" className="ai-link">AI Recommend</Link>
                </>
              )}
              {isInstructor && (
                <>
                  <Link to="/instructor">Dashboard</Link>
                  <Link to="/instructor/courses/create">+ New Course</Link>
                </>
              )}
              <span className="user-badge">{user.name} · {user.role}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
