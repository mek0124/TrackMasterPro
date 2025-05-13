/**
 * Mock API Implementation
 *
 * This module provides mock implementations of API endpoints for development and testing.
 * It simulates backend behavior with in-memory data storage and artificial response delays.
 */
import { v4 as uuidv4 } from 'uuid';

// Mock database configuration
const MOCK_DB = {
  // Default delay for all mock responses (ms)
  responseDelay: 300,

  // Mock users data
  users: [
    {
      id: 'user1',
      email: 'admin@trackmaster.com',
      password: 'admin123' // In a real app, this would be hashed
    }
  ],

  // Mock tasks data
  tasks: [
    {
      id: '1',
      title: 'Complete Project',
      detail: 'Finish the TrackMasterPro application',
      date: '2023-12-25',
      time: '14:30',
      completed: false,
      priority: 'high',
      userId: 1
    },
    {
      id: '2',
      title: 'Team Meeting',
      detail: 'Weekly team sync to discuss progress',
      date: '2023-12-26',
      time: '10:00',
      completed: true,
      priority: 'medium',
      userId: 1
    },
    {
      id: '3',
      title: 'Buy Groceries',
      detail: 'Get milk, eggs, and bread',
      date: '2023-12-27',
      time: '18:00',
      completed: false,
      priority: 'low',
      userId: 1
    },
    {
      id: '4',
      title: 'Read Documentation',
      detail: 'Study React hooks documentation',
      date: '2023-12-28',
      time: '20:00',
      completed: false,
      priority: 'medium',
      userId: 1
    },
    {
      id: '5',
      title: 'Exercise',
      detail: '30 minutes of cardio',
      date: '2023-12-29',
      time: '07:00',
      completed: false,
      priority: 'high',
      userId: 1
    }
  ]
};

/**
 * Helper function to create a delayed response
 */
const createResponse = (data, status = 200, delay = MOCK_DB.responseDelay) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ status, data });
    }, delay);
  });
};

/**
 * Helper function to extract credentials from different formats
 */
const extractCredentials = (credentials) => {
  // Handle different credential formats
  if (typeof credentials === 'string') {
    // Form URL-encoded format
    const params = new URLSearchParams(credentials);
    return {
      email: params.get('username') || params.get('email'),
      password: params.get('password')
    };
  }

  // JSON format
  return {
    email: credentials.email || credentials.username,
    password: credentials.password
  };
};

// Mock API implementation
const mockApi = {
  /**
   * Authentication
   */
  login: (credentials) => {
    const { email, password } = extractCredentials(credentials);

    // For development, accept any password that equals 'admin123'
    const isValidPassword = password === 'admin123';

    // Check if user exists in our mock database
    const user = MOCK_DB.users.find(u => u.email === email);
    const isExistingUser = !!user;

    // Log authentication attempt
    console.log('Mock API: Authentication attempt', {
      email,
      isValidPassword,
      isExistingUser
    });

    // Accept any email with password 'admin123' for easier testing
    if (isValidPassword) {
      return createResponse({
        userId: 1,
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        message: 'Login successful'
      });
    }

    // Invalid credentials
    return createResponse({
      message: 'Invalid credentials. Use any email with password "password" for testing.'
    }, 401);
  },

  /**
   * Task Management
   */
  getAllTasks: (userId) => {
    const userTasks = MOCK_DB.tasks.filter(task => task.userId === userId);
    return createResponse({ tasks: userTasks });
  },

  createTask: (taskData) => {
    const newTask = {
      ...taskData,
      id: uuidv4()
    };

    // Add to our mock database
    MOCK_DB.tasks.push(newTask);

    return createResponse(
      { task: newTask, message: 'Task created successfully' },
      201
    );
  },

  updateTask: (taskId, taskData) => {
    const taskIndex = MOCK_DB.tasks.findIndex(task => task.id === taskId);

    // Task not found
    if (taskIndex === -1) {
      return createResponse({ message: 'Task not found' }, 404);
    }

    // Update task
    const updatedTask = {
      ...MOCK_DB.tasks[taskIndex],
      ...taskData
    };

    MOCK_DB.tasks[taskIndex] = updatedTask;

    return createResponse(
      { task: updatedTask, message: 'Task updated successfully' }
    );
  },

  deleteTask: (taskId) => {
    const taskIndex = MOCK_DB.tasks.findIndex(task => task.id === taskId);

    // Task not found
    if (taskIndex === -1) {
      return createResponse({ message: 'Task not found' }, 404);
    }

    // Remove task
    MOCK_DB.tasks = MOCK_DB.tasks.filter(task => task.id !== taskId);

    return createResponse({ message: 'Task deleted successfully' });
  }
};

export default mockApi;
