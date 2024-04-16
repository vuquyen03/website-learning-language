import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import UserStatus from '../hooks/userStatus';

const Dashboard = () => {
    const { loggedIn, isLoading } = UserStatus();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }


    return (
        <section
            id="dashboard"
            className="w-full min-h-[calc(100vh-72px)] py-14">
                <div>
                    Dashboard
                </div>
        </section>
    );
};

export default Dashboard;