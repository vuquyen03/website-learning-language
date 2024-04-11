// import Auth from '../utils/auth';
import logo from '../assets/HustEdu.png';
import { Link, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';


const Signup = () => {
    // const loggedIn = Auth.loggedIn();
    const loggedIn = false;
    if (loggedIn) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <section
            id="login"
            className="w-full min-h-[calc(100vh-72px)] py-14 hero-bg">

        </section>
    );
};

export default Signup;