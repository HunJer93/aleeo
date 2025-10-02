import './App.css';
import { useEffect, useState } from 'react';
import { Provider } from "./components/ui/provider";
import UserLogin from './components/UserLogin';
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
      <Provider>
        <UserLogin users={users}/>
      </Provider>
    </div>

  );
}

export default App;
