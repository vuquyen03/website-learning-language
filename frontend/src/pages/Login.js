import { useState, useRef, useEffect } from 'react';
import logo from '../assets/HustEdu.png';
import { Link, Navigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { checkStatus } from '../redux/actions/userActions';

/**
 * Login component for user authentication.
 * @returns The login form.
 */
const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // state for displaying error message
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null); // Reference to the form element

    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.user.loggedIn);

    useEffect(() => {
        dispatch(checkStatus());
    });

    // console.log('Login:', loggedIn);

    if (loggedIn) {
        return <Navigate to="/dashboard" />;
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current);
        const inputData = Object.fromEntries(formData.entries());

        console.log(inputData);

        try {
            setIsLoading(true); // set isLoading true before making the request
            const response = await axios.post(
                process.env.REACT_APP_API_URL + '/login',
                inputData,
                { withCredentials: true });

            if (response.status === 200) {
                // setLoggedIn(true); 

                console.log('Đăng nhập thành công!', response.data);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            switch (true) {
                case error.message.includes('Incorrect credentials'):
                    setErrorMessage('Incorrect credentials');
                    break;
                default:
                    setErrorMessage('Something went wrong');
                    break;
            }
            console.error('Lỗi đăng nhập', error);
        }

    };

    return (
        <section
            id="login"
            className="w-full min-h-[calc(100vh-72px)] py-14 flex justify-center hero-bg"
        >
            {/* Log in form */}
            <form
                className="form-container-style"
                ref={formRef}
                onSubmit={handleSubmit}
            >
                <img
                    src={logo}
                    alt="HustEdu Logo"
                    className="w-20 h-20 mx-auto mb-2" />
                <h1 className="text-2xl font-bold mb-6 text-center">Log in</h1>

                <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="email">
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

                    <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="form-input-style w-full pl-3 pr-12 py-2 overflow-hidden"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                autoComplete="off"
                                required
                            />
                            {/* Show password button */}
                            <button
                                type="button"
                                onClick={handleShowPassword}
                                className="absolute inset-y-0 right-0 h-fit w-fit my-auto mr-2 p-2 rounded-full hover:bg-gray-300">
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {errorMessage && (
                    <p className="text-red-500 mt-6 inline-flex items-center text-sm text-center">
                        <FaExclamationCircle className="mr-1" />
                        {errorMessage}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    className="w-full mt-6 py-3 px-6 bg-primary hover:bg-primary-shade text-white font-bold rounded-xl"
                    type="submit"
                >
                    {isLoading ? <AiOutlineLoading className="animate-spin h-6 w-6 mx-auto" /> : 'Log in'}
                </button>


                <p className="mt-6 text-gray-500 dark:text-gray-400 text-center">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-bold text-primary hover:text-primary-shade hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </section>
    );
};

export default Login;