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

export const createMessage = async (params) => {
  try {
    const response = await apiClient.post('/messages', params)
    const { assistant_message } = response.data;
    return { assistantMessage: assistant_message };

  } catch (error) {
    alert("Sending message failed!");
    console.error('Sending message failed:', error);
  }
};

export const renameConversation = async (conversationId, newTitle) => {
  try {
    const response = await apiClient.put(`/conversations/${conversationId}`, { title: newTitle });
    return response.data;
  } catch (error) {
    alert("Renaming conversation failed!");
    console.error('Renaming conversation failed:', error);
  }
};

export const deleteConversation = async (conversationId) => {
  try {
    const response = await apiClient.delete(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    alert("Deleting conversation failed!");
    console.error('Deleting conversation failed:', error);
  }
};