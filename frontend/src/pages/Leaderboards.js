import React from "react";
import UserStatus from "../hooks/userStatus";
import { CircularProgress } from '@mui/material';
import { Navigate } from "react-router-dom";


const Leaderboards = () => {
    const { loggedIn, isLoading } = UserStatus();

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