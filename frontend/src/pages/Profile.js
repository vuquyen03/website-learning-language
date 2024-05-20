import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { FaExclamationCircle } from 'react-icons/fa';
import useUserStatus from '../hooks/useUserStatus';
import axios from 'axios';
import dateFormat from '../util/dateFormat';
import escapeHTML from '../util/escapeHTML';
import { useSelector } from 'react-redux';

const Profile = () => {
    const { loggedIn, isLoading } = useUserStatus();
    const [profileData, setProfileData] = useState('');
    const [fetchProfileDone, setFetchProfileDone] = useState(false);
    const [editProfilePopup, setEditProfilePopup] = useState(false);
    const [changePasswordPopup, setChangePasswordPopup] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const formRef = useRef(null);
    const userData = useSelector(state => state.user.userData);

    useEffect(() => {
        if (userData == null) return;
        
        const escapedData = {
            ...userData,
            username: escapeHTML(userData.username),
            email: escapeHTML(userData.email)
        }
        setProfileData(escapedData);
    },[]);


    // console.log("Profile data:", profileData)
    // console.log("Fetch profile done:", fetchProfileDone)
    // console.log("Loading:", isLoading)

    
    if (!loggedIn || profileData == null) {
        return <Navigate to="/login" />;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    const firstLetter = profileData.username?.charAt(0).toUpperCase();
    const date = dateFormat(profileData.createdAt, { dateSuffix: true });

    const handleEditProfile = async (e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current);
        const inputData = Object.fromEntries(formData.entries());

        try {
            setSubmitLoading(true);
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/user/profile`,
                inputData,
                { withCredentials: true }
            );

            // console.log("Update profile:", response);
            if (response.status === 200) {
                const escapedData = {
                    ...response.data,
                    username: escapeHTML(response.data.username),
                    email: escapeHTML(response.data.email)
                };
                setProfileData(escapedData);
                closeEditPopup();
            }

        } catch (error) {
            console.error("Error editing profile:", error);
            switch (true) {
                case error.response.data.error.includes('Incorrect old password'):
                    setErrorMessage('Incorrect old password');
                    break;
                case error.response.data.error.includes('Username is invalid, only contain a-z, A-Z, 0-9'):
                    setErrorMessage('Username is invalid, only contain a-z, A-Z, 0-9');
                    break;
                case error.response.data.error.includes('Username must be at least 3 characters'):
                    setErrorMessage('Username must be at least 3 characters');
                    break;
                case error.response.data.error.includes('Username already exists'):
                    setErrorMessage('Username already exists');
                    break;
                default:
                    setErrorMessage('Something went wrong');
                    break;
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current);
        const inputData = Object.fromEntries(formData.entries());

        try {
            setSubmitLoading(true);
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/user/change-password`,
                inputData,
                { withCredentials: true }
            );

            // console.log("Change password:", response);
            if (response.status === 200) {
                closeChangePasswordPopup();
            }

        } catch (error) {
            console.error("Error changing password:", error);
            switch (true) {
                case error.response.data.error.includes('Incorrect old password'):
                    setErrorMessage('Incorrect old password');
                    break;
                case error.response.data.error.includes('Password must be at least 6 characters'):
                    setErrorMessage('Password must be at least 6 characters');
                    break;
                case error.response.data.error.includes('Password does not match'):
                    setErrorMessage('Password does not match');
                    break;
                case error.response.data.error.includes('Password has been used before'):
                    setErrorMessage('Password has been used before');
                    break;
                default:
                    setErrorMessage('Something went wrong');
                    break;
            }
        } finally {
            setSubmitLoading(false);
        }

    };

    const openEditPopup = () => {
        setErrorMessage('');
        setEditProfilePopup(true);
    };

    const closeEditPopup = () => {
        setEditProfilePopup(false);
    };

    const openChangePasswordPopup = () => {
        setErrorMessage('');
        setChangePasswordPopup(true);
    };

    const closeChangePasswordPopup = () => {
        setChangePasswordPopup(false);
    };
    return (
        <section
            id="profile"
            className="w-full min-h-screen p-4 md:p-8"
        >
            {/* Profile Info */}
            <div className="box-container-style mb-8 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-32 h-32 bg-primary rounded-full flex justify-center items-center uppercase font-bold text-6xl text-white">
                    {firstLetter}
                </div>
                <div className="flex flex-col gap-2 text-center sm:text-left flex-grow">
                    <h2 className="text-2xl font-bold">{profileData.username}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{`Joined ${date}`}</p>
                </div>
                <div className="flex justify-end flex-col gap-2 sm:text-left">
                    <button
                        className="mt-2 py-3 px-6 bg-green-500 hover:bg-teal-700 text-white font-bold rounded-xl"
                        onClick={openEditPopup}>
                        Edit Profile
                    </button>
                    <button
                        className="mt-2 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                        onClick={openChangePasswordPopup}>
                        Change Password
                    </button>
                </div>
            </div>

            {editProfilePopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h3 className="text-2xl font-bold mb-4">Edit Profile</h3>
                        {/* Add your popup content here */}
                        <form
                            ref={formRef}
                            onSubmit={handleEditProfile}>
                            <div className="w-full flex flex-col gap-4">
                                <div>
                                    <input
                                        className="form-input-style px-4 py-2 w-full"
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder='New Username'
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        className="form-input-style px-4 py-2 w-full"
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder='Password'
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error message */}
                            {errorMessage && (
                                <p className="text-red-500 mt-3 inline-flex items-center text-sm text-center">
                                    <FaExclamationCircle className="mr-1" />
                                    {errorMessage}
                                </p>
                            )}

                            <div className="flex justify-center items-center mt-2">
                                <button
                                    type="submit"
                                    className="w-20 h-10 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                                >
                                    {submitLoading ? <CircularProgress size={25} className="animate-spin h-3 w-3" /> : 'Done'}
                                </button>
                            </div>
                        </form>

                        <div className="flex justify-center items-center mt-2">
                            <button className="w-20 h-10 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md" onClick={closeEditPopup}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {changePasswordPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h3 className="text-2xl font-bold mb-4">Change Password</h3>
                        {/* Add your popup content here */}
                        <form
                            ref={formRef}
                            onSubmit={handleChangePassword}>
                            <div className="w-full flex flex-col gap-4">
                                <div>
                                    <input
                                        className="form-input-style px-4 py-2 w-full"
                                        type="password"
                                        id="oldPassword"
                                        name="oldPassword"
                                        placeholder='Old Password'
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        className="form-input-style px-4 py-2 w-full"
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        placeholder='New Password'
                                        required
                                    />

                                </div>

                                <div>
                                    <input
                                        className="form-input-style px-4 py-2 w-full"
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder='Confirm Password'
                                        required
                                    />

                                </div>
                            </div>

                            {/* Error message */}
                            {errorMessage && (
                                <p className="text-red-500 mt-3 inline-flex items-center text-sm text-center">
                                    <FaExclamationCircle className="mr-1" />
                                    {errorMessage}
                                </p>
                            )}

                            <div className="flex justify-center items-center mt-2">
                                <button
                                    type="submit"
                                    className="w-20 h-10 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                                >
                                    {submitLoading ? <CircularProgress size={25} className="animate-spin h-3 w-3" /> : 'Done'}
                                </button>
                            </div>
                        </form>

                        <div className="flex justify-center items-center mt-2">
                            <button className="w-20 h-10 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md" onClick={closeChangePasswordPopup}>Close</button>
                        </div>

                    </div>
                </div>
            )}

            {/* Profile Statistics */}
            <div className="box-container-style mb-8 flex flex-col gap-4">
                <div>
                    <h4 className="text-gray-500 dark:text-gray-400">Total XP:</h4>
                    <h2 className="text-2xl font-bold">{profileData.experience}</h2>
                </div>
            </div>
        </section>
    );
};

export default Profile;