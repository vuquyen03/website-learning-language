// import Auth from '../utils/auth';
import logo from '../assets/HustEdu.png';
import { Link, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';


const Login = () => {
    // const loggedIn = Auth.loggedIn();
    const loggedIn = false;
    if (loggedIn) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <section
            id="login"
            className="w-full min-h-[calc(100vh-72px)] py-14 flex justify-center hero-bg">
            {/* Log in form */}
            <form className="form-container-style">
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
                        <input
                            className="form-input-style px-3 py-2"
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="off"
                            required
                        />
                    </div>

                    <button>

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
                </div>
            </form>

        </section>
    );
};

export default Login;