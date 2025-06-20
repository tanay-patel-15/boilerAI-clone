import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, MessageCircle, BookOpen, Calendar, FileText, Calculator, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purdue-gold rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purdue-black" />
            </div>
            <span className="text-xl font-bold text-purdue-black">Boiler AI</span>
          </Link>

          {/* Navigation Links */}
          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-purdue-gold transition-colors">
                Dashboard
              </Link>
              <Link to="/chat" className="text-gray-700 hover:text-purdue-gold transition-colors flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </Link>
              <Link to="/courses" className="text-gray-700 hover:text-purdue-gold transition-colors flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>Courses</span>
              </Link>
              <Link to="/schedule" className="text-gray-700 hover:text-purdue-gold transition-colors flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </Link>
              <Link to="/transcript" className="text-gray-700 hover:text-purdue-gold transition-colors flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Transcript</span>
              </Link>
              <Link to="/gpa" className="text-gray-700 hover:text-purdue-gold transition-colors flex items-center space-x-1">
                <Calculator className="w-4 h-4" />
                <span>GPA</span>
              </Link>
              
              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
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