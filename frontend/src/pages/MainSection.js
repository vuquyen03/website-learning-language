import { Link, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Home from './Home';
import AdminPanel from './AdminPanel';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ProtectedRoute from './ProtectRoute';
import Dashboard from './Dashboard';
import Sidebar from '../components/Sidebar';
import VerifyEmail from '../components/VerifyEmail';
import Profile from './Profile';
import Dictionary from './Dictionary';
import Leaderboards from './Leaderboards';
import InvalidRouteHandler from './InvalidRouteHandler';
import useUserStatus from '../hooks/useUserStatus';
import React, { useEffect } from 'react';
import useAccessTokenWithRefresh from '../hooks/useAccessTokenWithRefresh';

function MainSection() {
    const { loggedIn, isLoading, userData } = useUserStatus();
    const quizLocation = useLocation().pathname.includes('/quiz');
    const { pathname } = useLocation();

    // use this hook to refresh the access token when it is about to expire
    useAccessTokenWithRefresh();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    if (isLoading) {
        return null
    }

    const userRole = userData?.role;

    return (
        <>
            {loggedIn && userRole === 'user' && <Sidebar />}
            <div
                className={`overflow-x-hidden overflow-y-auto flex flex-col ${loggedIn && userRole === 'user' ? (quizLocation ? '' : 'mb-20 sm:mb-0 sm:ms-[88px] xl:ms-[300px]') : ''
                    }`}>
                {!loggedIn && <Header />}
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/verify-email/:status" element={<VerifyEmail />} />
                        {!loggedIn && (<Route
                            path="/reset-password/:token"
                            element={<ProtectedRoute />}
                        />)}

                        
                        {userRole !=='admin' && (
                            <>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/leaderboards" element={<Leaderboards />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/dictionary" element={<Dictionary />} />
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