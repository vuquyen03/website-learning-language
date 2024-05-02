import { useEffect, useState, useRef } from 'react';
import logo from '../assets/HustEdu.png';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { checkStatus, setUserRole } from '../redux/actions/userActions';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { AiOutlineLoading } from 'react-icons/ai';


/**
 * Signup component for user registration.
 * @returns The Signup form.
 */
const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);

    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.user.loggedIn);

    useEffect(() => {
        const checkLoginStatus = async () => {
            await dispatch(checkStatus());
        };

        checkLoginStatus();
    });

    if (loggedIn) {
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const inputData = Object.fromEntries(formData.entries());

        console.log(inputData);

        try {
            setIsLoading(true);
            const response = await axios.post(
                process.env.REACT_APP_API_URL + '/user/register',
                inputData,
                { withCredentials: true }
            );
            console.log(response);
            if (response.status === 201) {
                // Set user role in Redux
                dispatch(setUserRole(response.data.user.role));
                console.log(response.data.user.role);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);

            // set error message based on error message from server
            // username or email already exists, password shorter than 6 characters
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;

                switch (errorMessage) {
                    case 'Username already exists':
                        setErrorMessage('Username already exists');
                        break;
                    case 'Email already exists':
                        setErrorMessage('Email already exists');
                        break;
                    case 'Email must be a valid address':
                        setErrorMessage('Email must be a valid address');
                        break;
                    case 'Password must be at least 6 characters':
                        setErrorMessage('Password must be at least 6 characters');
                        break;
                    default:
                        setErrorMessage('Something went wrong');
                        break;
                }
            } else {
                setErrorMessage('Something went wrong');
            }
        }
    };


    return (
        <section
            id="signup"
            className="w-full min-h-[calc(100vh-72px)] py-14 flex justify-center hero-bg">
            {/* Sign up form */}
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="form-container-style"
            >
                <img
                    src={logo}
                    alt="HustEdu Logo"
                    className="w-20 h-20 mx-auto mb-2"
                />

                <h1 className="text-2xl font-bold mb-6 text-center">Sign up</h1>
                {/* Fields Container */}
                <div className="w-full flex flex-col gap-4">
                    {/* Username Field Wrapper*/}
                    <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <input
                            className="form-input-style px-3 py-2"
                            type="text"
                            id="username"
                            name="username"
                            required
                        />
                    </div>
                    {/* Email Field Wrapper*/}
                    <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="form-input-style px-3 py-2"
                            type="email"
                            id="email"
                            name="email"
                            required
                        />
                    </div>
                    {/* Password Field Wrapper */}
                    <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="password-input"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                autoComplete="off"
                                required
                            />
                            {/* Show password button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 h-fit w-fit my-auto mr-2 p-2 rounded-full hover:bg-gray-300"
                            >
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {errorMessage && (
                    <p className="text-red-500 mt-6 inline-flex items-center text-sm text-center">
                        {errorMessage}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    className="w-full mt-6 py-3 px-6 bg-primary hover:bg-primary-shade text-white font-bold rounded-xl"
                    type="submit"
                >
                    {isLoading ? <AiOutlineLoading className="animate-spin h-6 w-6 mx-auto" /> : 'Create account'}
                </button>

                <p className="mt-6 text-gray-500 text-center">
                    Already have an account? {' '}
                    <Link
                        to="/login"
                        className="font-bold text-primary hover:text-primary-shade hover:underline">
                        Log in
                    </Link>
                </p>


            </form>
        </section>
    );
};

export default Signup;