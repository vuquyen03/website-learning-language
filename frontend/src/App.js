import { useEffect } from 'react';
import AdminPanel from './pages/AdminPanel';
import { BrowserRouter} from 'react-router-dom';
import UserList from './components/UserList.Admin';
import MainSection from './pages/MainSection.js';

function App() {
  return (
    <BrowserRouter>
      <MainSection />
    </BrowserRouter>
  );
}

export default App;
