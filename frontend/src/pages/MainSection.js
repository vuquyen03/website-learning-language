import { Link, Navigate, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Home from './Home';
import AdminPanel from './AdminPanel';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Sidebar from '../components/Sidebar';
import Profile from './Profile';
import Leaderboards from './Leaderboards';
import InvalidRouteHandler from './InvalidRouteHandler';
import UserStatus from '../hooks/userStatus';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';



function MainSection() {
    const { loggedIn, isLoading } = UserStatus();
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        const checkRole = async () => {
            try {
                // Make an API call to check the user's role and determine if they are an admin
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/role`, { withCredentials: true });
                if (response.status === 200) {
                    setIsAdmin(response.data.role === 'admin');
                }
            } catch (error) {
                // Handle any network or other errors
                setIsAdmin(false);
                console.error('You are not authorized to view this page // or other error');
            }
        };

        checkRole();

    }, [loggedIn]);

    console.log('MainSection:', isAdmin);
    console.log('MainSection Login:', loggedIn);
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        )
    }
    return (
        <>
            {loggedIn && <Sidebar />}
            <div>
                {!loggedIn && <Header />}
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {!isAdmin && (
                            <>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/leaderboards" element={<Leaderboards />} />
                                <Route path="/profile" element={<Profile />} />
                            </>
                        )}

                        {/* Protected routes */}
                        {loggedIn && isAdmin && <Route path="/adminPanel/*" element={<AdminPanel />} />}

                        {/* Invalid routes */}
                        {/* <Route path="*" element={<InvalidRouteHandler />} /> */}
                    </Routes>
                </main>
            </div>
        </>
    );
}

export default MainSection;