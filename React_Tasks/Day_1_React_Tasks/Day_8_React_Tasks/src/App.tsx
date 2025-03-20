
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Employees from './pages/Employees';
import Projects from './pages/Projects';
import Roles from './pages/Roles';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AntApp>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                <Route 
                  path="users" 
                  element={
                    <ProtectedRoute requiredModule="users" requiredAction="view">
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="employees" 
                  element={
                    <ProtectedRoute requiredModule="employees" requiredAction="view">
                      <Employees />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="projects" 
                  element={
                    <ProtectedRoute requiredModule="projects" requiredAction="view">
                      <Projects />
                    </ProtectedRoute>
                  } 
                />
                
                
                <Route 
                  path="roles" 
                  element={
                    <ProtectedRoute requiredModule="roles" requiredAction="view">
                      <Roles />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              
              <Route path="*" element={<Navigate to="/unauthorized" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;