import React from "react";
import UserStatus from "../hooks/userStatus";
import { CircularProgress } from '@mui/material';
import { Navigate } from "react-router-dom";


const Leaderboards = () => {
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
            id="profile">
                <div>
                    Leaderboards
                </div>
        </section>
    )
};

export default Leaderboards;