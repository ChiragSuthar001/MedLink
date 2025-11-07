import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import './DoctorsLayout.css';

function DoctorsLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/');
  }

  function isActive(path) {
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  }

  return (
    <div className="main-layout">
      {/* Brand name at top left */}
      <div className="doctor-brand">
        <Link to="/doctor/availability" className="brand-link">
          MedLink
        </Link>
      </div>
      <div className="doctor-layout">
        <div className="doctor-menu-bar">
          <div className="sidebar-welcome">
            Welcome back, {user?.name || 'User'}
          </div>
          <nav className="sidebar-nav">
            <Link
              to="/doctor/availability"
              className={`sidebar-nav-item ${isActive('/doctor/availability') ? 'active' : ''}`}
            >
              Availability
            </Link>
            <Link
              to="/doctor/upcoming-appointments"
              className={`sidebar-nav-item ${isActive('/doctor/upcoming-appointments') ? 'active' : ''}`}
            >
              Upcoming Appointments
            </Link>
            <Link
              to="/doctor/past-appointments"
              className={`sidebar-nav-item ${isActive('/doctor/past-appointments') ? 'active' : ''}`}
            >
              Past Appointments
            </Link>
            <button
              onClick={handleLogout}
              className="sidebar-nav-item sidebar-logout"
            >
              Logout
            </button>
          </nav>
        </div>
        <div className="doctor-content">{children}</div>
      </div>
    </div>
  );
}

DoctorsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DoctorsLayout;
