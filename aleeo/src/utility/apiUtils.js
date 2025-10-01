import apiClient from "./api"

export const getUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return (response.data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};