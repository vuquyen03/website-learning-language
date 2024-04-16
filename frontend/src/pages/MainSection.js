import { Link, Navigate, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Home from './Home';
import AdminPanel from './AdminPanel';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Sidebar from '../components/Sidebar';
import Profile from './Profile';
import { useSelector } from 'react-redux';


function MainSection() {
    const loggedIn = useSelector(state => state.user.loggedIn);
    console.log('MainSection:', loggedIn);
    return (
        <>
            {loggedIn && <Sidebar />}
            <div>
                {!loggedIn && <Header />}
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

export default MainSection;