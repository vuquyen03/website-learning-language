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
import React, { useState, useEffect } from 'react';
import UserRole from '../hooks/userRole';


function MainSection() {
    const { loggedIn, isLoading } = UserStatus();
    const { userRole, userRoleDone } = UserRole();

    // console.log('MainSection UserRole:', userRole);
    if (isLoading || !userRoleDone) {
        return null
    }
    return (
        <>
            {loggedIn && userRole === 'user' && <Sidebar />}
            <div>
                {!loggedIn && <Header />}
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {userRole !=='admin' && (
                            <>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/leaderboards" element={<Leaderboards />} />
                                <Route path="/profile" element={<Profile />} />
                            </>
                        )}

                        {/* Protected routes */}
                        {loggedIn && userRole === 'admin' && <Route path="/adminPanel/*" element={<AdminPanel />} />}

                        {/* Invalid routes */}
                        <Route path="*" element={<InvalidRouteHandler />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

export default MainSection;