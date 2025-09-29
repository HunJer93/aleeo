import './App.css';
import axios from "axios";
import Users from './components/Users';
import { useEffect, useState } from 'react';

// move to store 
const API_URL = "http://localhost:3000/api/v1/users"

function getAPIData() {
  return axios.get(API_URL).then((response) => response.data)
}

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    getAPIData().then((items) => {
      if (mounted) {
        setUsers(items);
      }
    });

    return () => (mounted = false);

  }, []);

  return (
    <div className="App">
      <h1>Hello</h1>
      <Users users={users}/>
    </div>
  );
}

export default App;
