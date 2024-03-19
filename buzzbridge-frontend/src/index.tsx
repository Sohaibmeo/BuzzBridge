import { BrowserRouter } from 'react-router-dom';
import { AlertProvider } from './components/Providers/AlertProvider';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './components/Providers/UserProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
      <AlertProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </AlertProvider>
  </BrowserRouter>,
);

reportWebVitals();
