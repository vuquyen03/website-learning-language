// import Auth from '../utils/auth';
import { useEffect, useState } from 'react';
import logo from '../assets/HustEdu.png';
import { Link, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { checkStatus } from '../redux/actions/userActions';

/**
 * Signup component for user registration.
 * @returns The Signup form.
 */
const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const loggedIn = useSelector(state => state.user.loggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkStatus());
    });

    if (loggedIn) {
        return <Navigate to="/dashboard" />;
    }


    return (
        <section
            id="signup"
            className="w-full min-h-[calc(100vh-72px)] py-14 hero-bg">
                Signup
        </section>
    );
};

export default Signup;