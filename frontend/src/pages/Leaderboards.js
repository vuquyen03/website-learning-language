import React from "react";
import useUserStatus from "../hooks/useUserStatus";
import { Navigate } from "react-router-dom";


const Leaderboards = () => {
    const { loggedIn, isLoading } = useUserStatus();

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