import './App.css';
import { Provider } from "./components/ui/provider";
import UserLogin from './components/UserLogin';


function App() {

  return (
    <div className="App">
      <Provider>
        <UserLogin/>
      </Provider>
    </div>

  );
}

export default App;
