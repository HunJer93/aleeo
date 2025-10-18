import apiClient from "./api"

export const userLogin = async (params) => {
  try {
    const response = await apiClient.post('/login', params, {
      withCredentials: true, // Ensures cookies are sent/received (if not set globally)
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    alert("Login failed!");
    console.error('Login failed:', error);
  }
};

export const createConversation = async (params) => {
  try {
    const response = await apiClient.post('/conversations', params)
    return response.data;

  } catch (error) {
    alert("Creating conversation failed!");
    console.error('Creating conversation failed:', error);
  }
};

export const sendMessage = async (params) => {
  try {
    const response = await apiClient.post('/messages', params)
    return response.data;

  } catch (error) {
    alert("Sending message failed!");
    console.error('Sending message failed:', error);
  }
};