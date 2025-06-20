import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Courses from './pages/Courses';
import Schedule from './pages/Schedule';
import Transcript from './pages/Transcript';
import GPA from './pages/GPA';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/courses" 
                element={
                  <PrivateRoute>
                    <Courses />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/schedule" 
                element={
                  <PrivateRoute>
                    <Schedule />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/transcript" 
                element={
                  <PrivateRoute>
                    <Transcript />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/gpa" 
                element={
                  <PrivateRoute>
                    <GPA />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 