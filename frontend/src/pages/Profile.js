import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import useUserStatus from '../hooks/useUserStatus';

const Profile = () => {
    const { loggedIn, isLoading } = useUserStatus();

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
            id="profile"
            className="w-full min-h-[calc(100vh-72px)] py-14">
            <div>
                Profile
            </div>
        </section>
    );
};

export default Profile;