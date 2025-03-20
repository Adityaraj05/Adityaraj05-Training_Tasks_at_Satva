import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, RolePermissions, AuthContextType } from '../types';
import { loginUser, getPermissionByRole } from '../api/api';
import { createToken, verifyToken, isTokenExpired, comparePassword } from '../utils/auth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  permissions: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<RolePermissions | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check token validity on initial load
  useEffect(() => {
    const checkToken = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Check if token is expired
      const expired = await isTokenExpired(token);
      if (expired) {
        logout();
        setLoading(false);
        return;
      }
      
      // Verify token and get user data
      const payload = await verifyToken(token);
      if (payload && payload.userId && payload.role) {
        try {
          // In a real app, you would fetch the user from the server
          // Here we're simulating by using the payload data
          const userData = {
            id: payload.userId as number,
            name: '', // We don't have this in the token
            email: '', // We don't have this in the token
            password: '', // We don't store this
            role: payload.role as string,
          };
          
          setUser(userData);
          
          // Fetch permissions for the user's role
          const permissionData = await getPermissionByRole(userData.role);
          if (permissionData && permissionData.modules) {
            setPermissions(permissionData.modules);
          }
          
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
          logout();
        }
      } else {
        logout();
      }
      
      setLoading(false);
    };
    
    checkToken();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const users = await loginUser(email, password);
      
      if (users.length === 0) {
        setLoading(false);
        return false;
      }
      
      const user = users[0];
      
      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        setLoading(false);
        return false;
      }
      
      // Create token
      const token = await createToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      
      // Store token
      localStorage.setItem('token', token);
      
      // Set user state
      setUser(user);
      
      // Fetch permissions for the user's role
      const permissionData = await getPermissionByRole(user.role);
      if (permissionData && permissionData.modules) {
        setPermissions(permissionData.modules);
      }
      
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPermissions(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Set up token expiry check
  useEffect(() => {
    const checkTokenExpiry = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const expired = await isTokenExpired(token);
        if (expired) {
          logout();
        }
      }
    };
    
    // Check token expiry every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Add window listener for storage changes
  useEffect(() => {
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'token') {
        const newToken = event.newValue;
  
        if (!newToken) {
          logout();
        } else {
          const expired = await isTokenExpired(newToken);
          if (expired) {
            logout();
          } else {
            const payload = await verifyToken(newToken);
            if (!payload || !payload.userId || !payload.role) {
              logout();
            }
          }
        }
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};