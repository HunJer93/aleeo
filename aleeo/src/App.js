import './App.css';
import { useEffect, useState } from 'react';
import { Provider } from "./components/ui/provider";
import UserLogin from './components/UserLogin';
import { getUsers } from './utility/apiUtils';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


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
      <ChakraProvider>
        <Router>
          <Provider>
            <Routes>
              <Route path="/" element={<UserLogin users={users}/>} />
              {/* Add more routes here */}
            </Routes>
          </Provider>
        </Router>
      </ChakraProvider>
    </div>

  );
}

export default App;
