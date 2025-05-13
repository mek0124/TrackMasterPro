/**
 * WebSocket Client for TrackMasterPro
 * 
 * This module provides WebSocket functionality for real-time updates.
 * In production, it connects to the backend WebSocket server.
 */

class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.messageHandlers = [];
  }

  connect() {
    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log('WebSocket connection established');
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = () => {
        this.isConnected = false;
        this.handleReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Don't attempt to reconnect on error in production
        // as it might be a configuration issue
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }
  
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      this.reconnectTimeout = setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect();
      }, delay);
    } else {
      console.warn('Maximum reconnect attempts reached. WebSocket connection failed.');
    }
  }
  
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket && this.isConnected) {
      this.socket.close();
      this.isConnected = false;
    }
  }
  
  send(data) {
    if (this.socket && this.isConnected) {
      try {
        this.socket.send(JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    }
    return false;
  }
  
  addMessageHandler(handler) {
    if (typeof handler === 'function') {
      this.messageHandlers.push(handler);
    }
  }
  
  removeMessageHandler(handler) {
    const index = this.messageHandlers.indexOf(handler);
    if (index !== -1) {
      this.messageHandlers.splice(index, 1);
    }
  }
}

// Socket connection management
let socketInstance = null;

export const initSocket = (userId) => {
  // Only create a new socket if one doesn't exist
  if (!socketInstance) {
    try {
      // In production, we would use a secure WebSocket connection
      const wsUrl = `ws://localhost:8000/ws/${userId}`;
      socketInstance = new WebSocketClient(wsUrl);
      socketInstance.connect();
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }
  return socketInstance;
};

export const getSocket = () => socketInstance;

export const closeSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export default {
  initSocket,
  getSocket,
  closeSocket
};
