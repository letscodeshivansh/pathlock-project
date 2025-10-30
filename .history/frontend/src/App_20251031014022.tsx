import React from 'react';

import {
  Link,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import ProjectDetails from './pages/ProjectDetails';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './services/AuthContext';

export default function App() {
  const navigate = useNavigate()
  const { isAuthenticated: auth, logout } = useAuth()

  function doLogout(){
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold">Mini Project Manager</Link>
          <div>
            {!auth ? (
              <>
                <Link to="/login" className="mr-4">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ) : (
              <button onClick={doLogout} className="text-red-600">Logout</button>
            )}
          </div>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/projects/:id" element={<ProjectDetails/>} />
        </Routes>
      </div>
    </div>
  )
}
