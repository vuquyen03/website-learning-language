import { Link, Navigate, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Home from './Home';
import AdminPanel from './AdminPanel';
import Login from './Login';
import Signup from './Signup';


function MainSection() {
    // const loggedIn = Auth.loggedIn();
    const loggedIn = false;

    return (
        <div>
            {!loggedIn && <Header/>}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </div>
    );
}

export default MainSection;