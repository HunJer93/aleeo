import apiClient from "./api"

export const getUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};

export const userLogin = async (params) => {
  try {
    const response = await apiClient.post('/login', params)
    return response.data;

  } catch (error) {
    alert("Login failed!");
    console.error('Login failed:', error);
  }
};