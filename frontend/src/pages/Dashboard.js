import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import useUserStatus from '../hooks/useUserStatus';
import ReCAPTCHA from "react-google-recaptcha";

const Dashboard = () => {
    const { loggedIn, isLoading } = useUserStatus();
    const [isVerified, setIsVerified] = useState(false);

    const handleRecaptchaChange = (value) => {
        setIsVerified(true);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (isVerified) {
            console.log("reCAPTCHA đã được xác thực");
        } else {
            console.log("reCAPTCHA chưa được xác thực");
        }
    }

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <section id="dashboard" className="w-full min-h-[calc(100vh-72px)] py-14">
            <form onSubmit={handleSubmit}>
                <ReCAPTCHA
                    sitekey="6LdxD9opAAAAAGYoUI2b5MQ2q-cwZTWhARWUPH3s"
                    onChange={handleRecaptchaChange}
                    theme="light"
                />
                <br />
                <input type="submit" value="Submit"/>
            </form>
        </section>
    );
};

export default Dashboard;