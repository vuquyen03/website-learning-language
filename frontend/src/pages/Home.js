import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import countryLogo from '../assets/HomePage.png';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// import Auth from '../utils/auth';

const Home = () => {
    //   const loggedIn = Auth.loggedIn();
    const loggedIn = false;
    if (loggedIn) {
        return <Navigate to="/dashboard" />;
    }

    return (
        // Hero Section with Logo and Call to Action
        <section
            id="hero"
            className="w-full min-h-[calc(100vh-72px)] py-14 hero-bg"
        >
            <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Call to Action */}
                <div className="flex flex-col items-center lg:items-start font-bold text-center lg:text-left gap-8 order-last lg:order-first">
                    <h1 className="text-xl md:text-2xl lg:text-3xl uppercase">
                        The Best Way To Study <br />
                        <span className="text-green-400 text-5xl md:text-6xl lg:text-7xl">English</span>
                    </h1>
                    <p className="max-w-md md:text-xl text-gray-500 dark:text-gray-400">
                        Practice English vocabulary and phrases with our engaging lessons and quizzes.
                    </p>
                    <div className="w-50 gap-4">
                        <Stack direction="row" spacing={2}>
                            <div className='w-72 flex flex-col text-center gap-3'>
                                <Link to="/login">
                                    <Button variant="contained" color="success" className='w-60' sx={{
                                        borderRadius: '8px',
                                    }}>
                                        Start Learning
                                    </Button>
                                </Link>

                                <Link to="/signup">
                                    <Button variant="outlined" color="error" className='w-60' sx={{
                                        borderRadius: '8px',
                                    }}>
                                        Create an Account
                                    </Button>
                                </Link>
                            </div>
                        </Stack>
                    </div>
                </div>

                {/* Country Logo */}
                <img
                    src={countryLogo}
                    alt="Japan Country Logo"
                    className="w-48 h-48 md:w-80 md:h-80 lg:w-[550px] lg:h-[400px] transition-all duration-300 ease-in-out"
                />
            </div>
        </section>
    );
};

export default Home;
