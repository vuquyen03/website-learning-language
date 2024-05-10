import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import useUserStatus from '../hooks/useUserStatus';
import axios from 'axios';
import dateFormat from '../util/dateFormat';

const Profile = () => {
    const { loggedIn, isLoading } = useUserStatus();
    const [profileData, setProfileData] = useState(null);
    const [fetchProfileDone, setFetchProfileDone] = useState(false);
    const [editProfilePopup, setEditProfilePopup] = useState(false);
    const [changePasswordPopup, setChangePasswordPopup] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (loggedIn) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, { withCredentials: true });
                    // console.log(response)
                    setProfileData(response.data.user);
                } else {
                    setProfileData(null);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setFetchProfileDone(true);
            }
        };

        setFetchProfileDone(false);
        fetchProfile();
        // console.log("Profile data:", profileData);
    }, [loggedIn]);

    if (isLoading || !fetchProfileDone || profileData == null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    const firstLetter = profileData.username?.charAt(0).toUpperCase();
    const date = dateFormat(profileData.createdAt, { dateSuffix: true });

    const handleEditProfile = () => {

    };

    const handleChangePassword = () => {

    };

    const openEditPopup = () => {
        setEditProfilePopup(true);
    };

    const closeEditPopup = () => {
        setEditProfilePopup(false);
    };

    const openChangePasswordPopup = () => {
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
                    <div className="bg-white p-8 rounded-lg">
                        <h3 className="text-2xl font-bold mb-4">Edit Profile</h3>
                        {/* Add your popup content here */}
                        <form
                            onSubmit={handleEditProfile}>
                            <div className="w-full flex flex-col gap-4">
                                <div>
                                    <input
                                        className="form-input-style px-4 py-2"
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder='New Username'
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        className="form-input-style px-4 py-2"
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder='Password'
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center items-center mt-2">
                                <button
                                    type="submit"
                                    className="w-20 h-10 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? <CircularProgress className="animate-spin h-6 w-6 mx-auto" /> : 'Done'}
                                </button>
                            </div>
                        </form>

                        <div className="flex justify-center items-center mt-2">
                            <button class="w-20 h-10 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md" onClick={closeEditPopup}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {changePasswordPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg w-auto">
                        <h3 className="text-2xl font-bold mb-4">Change Password</h3>
                        {/* Add your popup content here */}
                        <form
                            onSubmit={handleChangePassword}>
                            <div className="w-full flex flex-col gap-4">
                                <div>
                                    <input
                                        className="form-input-style px-4 py-2"
                                        type="password"
                                        id="oldpassword"
                                        name="oldpassword"
                                        placeholder='Old Password'
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        className="form-input-style px-4 py-2"
                                        type="password"
                                        id="newpassword"
                                        name="newpassword"
                                        placeholder='New Password'
                                        required
                                    />

                                </div>

                                <div>
                                    <input
                                        className="form-input-style px-4 py-2"
                                        type="password"
                                        id="confirmpassword"
                                        name="confirmpassword"
                                        placeholder='Confirm Password'
                                        required
                                    />

                                </div>
                            </div>

                            <div className="flex justify-center items-center mt-2">
                                <button
                                    type="submit"
                                    className="w-20 h-10 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? <CircularProgress className="animate-spin h-6 w-6 mx-auto" /> : 'Done'}
                                </button>
                            </div>
                        </form>

                        <div className="flex justify-center items-center mt-2">
                            <button class="w-20 h-10 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md" onClick={closeChangePasswordPopup}>Close</button>
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