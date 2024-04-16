import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdminPanel from './pages/AdminPanel';
import { Provider } from 'react-redux';
import store from './redux/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap provider around App and pass store as prop */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);