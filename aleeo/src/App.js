import './App.css';
import Users from './components/Users';
import { useEffect, useState } from 'react';
import apiClient from './utility/api';


function App() {
  const [users, setUsers] = useState([]);

useEffect(() => {
const fetchData = async () => {
  try {
    const response = await apiClient.get('/users');
    setUsers(response.data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};

fetchData();
}, []);

  return (
    <div className="App">
      <h1>{process.env.REACT_APP_API_URL}</h1>
      <Users users={users}/>
    </div>
  );
}

export default App;
