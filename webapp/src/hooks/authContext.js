import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

/**
 * Authentication Context
 *
 * Provides authentication state and methods for the application.
 */
const AuthContext = createContext();

// Storage keys
const STORAGE_KEYS = {
  USER_ID: 'loggedUserId',
  TOKEN: 'token',
  REMEMBER_ME: 'rememberMe'
};

export const AuthProvider = ({ children }) => {
  // Authentication state
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Load authentication state from storage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const remembered = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';

    setRememberMe(remembered);

    if (storedUserId && storedToken) {
      setUserId(JSON.parse(storedUserId));
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  /**
   * Handles successful login by storing authentication data
   */
  const handleAuthSuccess = (data, remember) => {
    // Extract authentication data
    const { access_token, token: responseToken, userId: responseUserId } = data;
    const authToken = access_token || responseToken;

    console.log('Auth success data:', {
      access_token,
      responseToken,
      responseUserId,
      authToken
    });

    // Update state
    setUserId(responseUserId);
    setToken(authToken);
    setRememberMe(remember);
    setIsLoading(false);

    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(responseUserId));
    localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, remember);

    console.log('Stored auth data in localStorage:', {
      userId: localStorage.getItem(STORAGE_KEYS.USER_ID),
      token: localStorage.getItem(STORAGE_KEYS.TOKEN) ? 'Present' : 'Missing',
      rememberMe: localStorage.getItem(STORAGE_KEYS.REMEMBER_ME)
    });

    return {
      status: 200,
      message: 'Login successful'
    };
  };

  /**
   * Login with email and password
   */
  const login = async ({ email, password, remember = false }) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with:', { email, remember });

      // Force the use of the real API for login
      const response = await api.auth.loginJson({ email, password }, { forceMode: 'real' });
      console.log('Login response:', {
        status: response.status,
        data: response.data
      });

      if (response.status === 200) {
        return handleAuthSuccess(response.data, remember);
      }

      // If we get here, login failed
      setIsLoading(false);
      console.warn('Login failed with status:', response.status);
      return {
        status: response.status,
        message: response.data?.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setIsLoading(false);

      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'An unexpected error occurred'
      };
    }
  };

  /**
   * Logout the current user
   */
  const logout = () => {
    setIsLoading(true);

    // Clear authentication state
    setUserId(null);
    setToken('');

    // Clear storage if not remembering
    if (!rememberMe) {
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }

    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);

    setIsLoading(false);
    navigate('/');
  };

  // Context value
  const contextValue = {
    // Authentication state
    userId,
    token,
    isAuthenticated: !!userId,
    isLoading,
    rememberMe,

    // Authentication methods
    login,
    logout,
    setRememberMe
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);
