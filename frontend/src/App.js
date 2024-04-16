import { useEffect } from 'react';
import AdminPanel from './pages/AdminPanel';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserList from './components/UserList.Admin';
import MainSection from './pages/MainSection.js';

function App() {

  // get darkMode state from store
  // const darkMode = useSelector((state) => state.darkMode.value)

  return (
    <BrowserRouter>
      <MainSection /> 
    </BrowserRouter>
  );
}

export default App;
