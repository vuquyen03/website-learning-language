import { useEffect } from 'react';
import AdminPanel from './pages/AdminPanel';
import { Admin, Resource, ShowGuesser, EditGuesser } from "react-admin";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserList from './components/UserList.Admin';
import CourseList from './components/CourseList.Admin';
import MainSection from './pages/MainSection.js';
import Home from './pages/Home.js';

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
