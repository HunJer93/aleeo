import './App.css';
import { Provider } from "./components/ui/provider";
import { AuthProvider } from './contexts/AuthContext';
import UserLogin from './components/UserLogin';


function App() {

  return (
    <div className="App">
      <Provider>
        <AuthProvider>
          <UserLogin/>
        </AuthProvider>
      </Provider>
    </div>

  );
}

export default App;
