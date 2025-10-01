import './App.css';
import Users from './components/Users';
import { useEffect, useState } from 'react';
import { getUsers } from './utility/apiUtils';


function App() {
  const [users, setUsers] = useState([]);

  // only make API request on inital page load.
  useEffect(() => {
    let mounted = true;
    getUsers().then((response) => {
      if (mounted) {
        setUsers(response);
      }
    });

    return () => (mounted = false);
  }, []);

  return (
    <div className="App">
      <h1>{process.env.REACT_APP_MODE}</h1>
      <Users users={users}/>
    </div>
  );
}

export default App;
