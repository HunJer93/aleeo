import './App.css';
import { Provider } from "./components/ui/provider";
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import UserLogin from './components/UserLogin';


function App() {

  return (
    <div className="App">
      <ReduxProvider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <Provider>
            <UserLogin/>
          </Provider>
        </PersistGate>
      </ReduxProvider>
    </div>

  );
}

export default App;
