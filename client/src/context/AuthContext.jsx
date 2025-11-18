import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create authentication context
const AuthContext = createContext();

/**
 * AuthProvider component - Manages user authentication state
 * Stores JWT token in localStorage and manages login/logout
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (on app load)
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Handle Google login
  const login = async (googleToken) => {
    try {
      const response = await authAPI.googleLogin(googleToken);
      const { token: jwtToken, user: userData } = response.data;

      // Store JWT token
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser(userData);

      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
