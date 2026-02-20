import { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../api/auth';

const AuthContext = createContext(null);

/**
 * Authentication context provider that manages user state.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData.user);
      setError(null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const register = async (data) => {
    try {
      setError(null);
      const response = await registerUser(data);
      return { success: true, data: response };
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData);
      return { success: false, error: errorData };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await loginUser(credentials);
      setUser(response.user);
      return { success: true, data: response };
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData);
      return { success: false, error: errorData };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access the authentication context.
 * @returns {Object} Auth context with user, loading, error, register, login, logout, checkAuth
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
