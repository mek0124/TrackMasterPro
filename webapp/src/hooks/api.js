import axios from 'axios';
import mockApi from './mockApi';

// API configuration
const API_CONFIG = {
  // API mode: 'mock', 'real', or 'hybrid'
  // - 'mock': Always use mock API
  // - 'real': Always use real API
  // - 'hybrid': Try real API first, fall back to mock on failure
  mode: 'real',

  // Real API settings
  realApi: {
    baseURL: 'http://localhost:8000',
    timeout: 10000
  },

  // Enable/disable detailed logging
  logging: true
};

// Create axios instance for real API
const axiosInstance = axios.create({
  baseURL: API_CONFIG.realApi.baseURL,
  timeout: API_CONFIG.realApi.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token to requests
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (API_CONFIG.logging) {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`Token in localStorage: ${token ? 'Present' : 'Missing'}`);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (API_CONFIG.logging) {
      console.log('Added Authorization header with Bearer token');
    }
  } else {
    console.warn('No token found in localStorage, request will be unauthorized');
  }

  return config;
});

// Handle response logging and errors
axiosInstance.interceptors.response.use(
  response => {
    if (API_CONFIG.logging) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  error => {
    if (API_CONFIG.logging) {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message
      });
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.warn('Authentication error: Token may be invalid or expired');
    }

    return Promise.reject(error);
  }
);

// Helper to determine if we should use mock API for a request
const shouldUseMock = (endpoint, forceMode = null) => {
  // Use specified mode if provided
  const mode = forceMode || API_CONFIG.mode;

  // Always use mock in mock mode
  if (mode === 'mock') return true;

  // Never use mock in real mode
  if (mode === 'real') return false;

  // In hybrid mode, we want to try the real API first
  // Only return true if we're explicitly forcing mock mode
  if (mode === 'hybrid') {
    return false;
  }

  return false;
};

// Helper to route request to appropriate implementation
const routeRequest = async (method, url, data = null, options = {}) => {
  try {
    // Log the request details
    if (API_CONFIG.logging) {
      console.log(`API Request: ${method.toUpperCase()} ${url}`, { data, options });
      console.log(`Token: ${localStorage.getItem('token') ? 'Present' : 'Missing'}`);
    }

    // Check if we should use mock API
    if (shouldUseMock(url, options.forceMode)) {
      if (API_CONFIG.logging) {
        console.log(`Using mock API for: ${method.toUpperCase()} ${url}`);
      }

      // Route to appropriate mock handler
      if (url === '/auth/login' || url === '/auth/login/json') {
        return mockApi.login(data);
      }

      if (url.includes('/tasks/') && url.includes('/all')) {
        const userId = url.split('/')[2];
        return mockApi.getAllTasks(userId);
      }

      if (url === '/tasks' && method === 'post') {
        return mockApi.createTask(data);
      }

      if (url.startsWith('/tasks/') && method === 'put') {
        const taskId = url.split('/')[2];
        return mockApi.updateTask(taskId, data);
      }

      if (url.startsWith('/tasks/') && method === 'delete') {
        const taskId = url.split('/')[2];
        return mockApi.deleteTask(taskId);
      }

      // Generic success for unhandled mock endpoints
      return {
        status: 200,
        data: { message: 'Operation successful (mock)' }
      };
    }

    // Use real API
    const response = await axiosInstance[method](url, data);
    return response;
  } catch (error) {
    // Log detailed error information
    console.error('API request failed:', {
      url,
      method,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    // In hybrid mode, fall back to mock API
    if (API_CONFIG.mode === 'hybrid' && !options.skipMockFallback) {
      console.warn('API request failed, falling back to mock API');

      // Try with mock API
      if (url === '/auth/login' || url === '/auth/login/json') {
        return mockApi.login(data);
      }

      if (url.includes('/tasks/') && url.includes('/all')) {
        const userId = url.split('/')[2];
        return mockApi.getAllTasks(userId);
      }

      if (url === '/tasks' && method === 'post') {
        return mockApi.createTask(data);
      }

      if (url.startsWith('/tasks/') && method === 'put') {
        const taskId = url.split('/')[2];
        return mockApi.updateTask(taskId, data);
      }

      if (url.startsWith('/tasks/') && method === 'delete') {
        const taskId = url.split('/')[2];
        return mockApi.deleteTask(taskId);
      }

      // Generic success for unhandled mock endpoints
      return {
        status: 200,
        data: { message: 'Operation successful (mock fallback)' }
      };
    }

    throw error;
  }
};

// Clean API interface
const api = {
  // Auth methods
  auth: {
    login: (credentials, options) => routeRequest('post', '/auth/login', credentials, options),
    loginJson: (credentials, options) => routeRequest('post', '/auth/login/json', credentials, options)
  },

  // Task methods
  tasks: {
    getAll: (userId, options) => routeRequest('post', `/tasks/${userId}/all`, {}, options),
    create: (taskData, options) => routeRequest('post', '/tasks', taskData, options),
    update: (taskId, taskData, options) => routeRequest('put', `/tasks/${taskId}`, taskData, options),
    delete: (taskId, options) => routeRequest('delete', `/tasks/${taskId}`, null, options)
  },

  // Generic methods (for compatibility with existing code)
  get: (url, config) => routeRequest('get', url, null, config),
  post: (url, data, config) => routeRequest('post', url, data, config),
  put: (url, data, config) => routeRequest('put', url, data, config),
  delete: (url, config) => routeRequest('delete', url, config),
  patch: (url, data, config) => routeRequest('patch', url, data, config)
};

export default api;
