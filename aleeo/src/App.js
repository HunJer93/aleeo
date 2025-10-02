import './App.css';
import { useEffect, useState } from 'react';
import { Provider } from "./components/ui/provider";
import UserLogin from './components/UserLogin';
import { getUsers } from './utility/apiUtils';
import { Button } from '@chakra-ui/react';


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
      <Provider>
        <h1>{process.env.REACT_APP_MODE}</h1>
        <UserLogin users={users}/>
        <Button>Click me</Button>
      </Provider>
    </div>

  );
}

export default App;
