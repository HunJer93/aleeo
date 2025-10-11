import apiClient from "./api"

export const userLogin = async (params) => {
  try {
    const response = await apiClient.post('/login', params)
    return response.data;

  } catch (error) {
    alert("Login failed!");
    console.error('Login failed:', error);
  }
};