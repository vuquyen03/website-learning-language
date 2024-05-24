import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendToken } from '../middlewares/auth/sendToken.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendMail } from '../helper/sendMail.js';
import validator from 'validator';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        return { accessToken, refreshToken };
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong while generating refresh and acess token'});
    }
};

const userController = {
    // Method: POST
    // Path: /user/register
    register: async (req, res) => {
        try {
            const { username, email, password, confirmPassword } = req.body;
            const recaptchaResponse = req.body['g-recaptcha-response'];

            // validate user input


            if (recaptchaResponse) {
                try {
                    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
                    const recaptchaVerifyResponse = await fetch(recaptchaVerifyUrl, { method: 'POST' });
                    const recaptchaVerifyData = await recaptchaVerifyResponse.json();
                    if (!recaptchaVerifyData.success) {
                        return res.status(400).json({ message: 'reCAPTCHA verification failed' });
                    }

                    continueRegister();

                } catch (error) {
                    console.log(error);
                    return res.status(400).json({ message: 'reCAPTCHA verification failed' });
                }
            } else {
                return res.status(400).json({ message: 'reCAPTCHA verification failed' });
            }
            
            async function continueRegister() {
                if (!username || !email || !password || !confirmPassword) {
                    return res.status(400).json({ message: 'All fields are required' });
                }

                // check if username has invalid characters
                if (!/^[a-zA-Z0-9]+$/.test(username)) {
                    return res.status(400).json({ message: 'Username is invalid, only contain a-z, A-Z, 0-9', field: 'username' });
                }

                if (username.length < 3) {
                    return res.status(400).json({ message: 'Username must be at least 3 characters', field: 'username' });
                }

                // check if user already exists
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    return res.status(400).json({ message: 'Username already exists', field: 'username' });
                }

                const existingEmail = await User.findOne({ email });
                if (existingEmail) {
                    return res.status(400).json({ message: 'Email already exists', field: 'email' });
                }

                if (!validator.isStrongPassword(password)){
                    return res.status(400).json({ message: 'Password is too weak' });
                }

                if (password !== confirmPassword) {
                    return res.status(400).json({ message: 'Password does not match' });
                }

                let verificationToken = crypto.randomBytes(32).toString('hex');
                const newUser = new User({ username, email, password, verifyToken: verificationToken });
                await newUser.save();
                res.cookie('verificationToken', verificationToken, { httpOnly: true, secure: true, sameSite: 'Lax', maxAge: 1000 * 60 * 30 }); 

                // send verification email
                const verificationUrl = `${process.env.SERVER_URL}/user/verify-email/${verificationToken}`;
                const html = `<p>Please click <a href="${verificationUrl}">here</a> to verify your email address.</p>`;
                console.log(html);
                await sendMail(email, 'Verify your email address', html);

                const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser._id);

                // send token
                sendToken(res, newUser, accessToken, refreshToken, "Registered Successfully", 201);
            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: POST
    // Path: /user/login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const recaptchaResponse = req.body['g-recaptcha-response'];

            if (recaptchaResponse) {
                try {
                    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
                    const recaptchaVerifyResponse = await fetch(recaptchaVerifyUrl, { method: 'POST' });
                    const recaptchaVerifyData = await recaptchaVerifyResponse.json();

                    if (!recaptchaVerifyData.success) {
                        return res.status(400).json({ message: 'reCAPTCHA verification failed' });
                    }

                    continueLogin();
                } catch (error) {
                    return res.status(400).json({ message: 'reCAPTCHA verification failed' });
                }
            } else {
                continueLogin();
            }

            async function continueLogin() {
                if (!email || !password) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
    
                const user = await User.findOne({ email }).select('-refreshToken -passwordHistory -resetPasswordToken -resetPasswordExpires -verifyToken');
                if (!user) {
                    return res.status(400).json({ message: 'Incorrect Email or Password' });
                }
    
                if (user.loginAttempts >= 5 && !recaptchaResponse) {
                    return res.status(400).json({ message: 'Please complete the reCAPTCHA' });
                }
    
                const isMatch = await user.isCorrectPassword(password);
                if (!isMatch) {
                    user.loginAttempts += 1;
                    await user.save();
                    return res.status(400).json({ message: 'Incorrect Email or Password' });
                }
    
                user.loginAttempts = 0;
                await user.save();
    
                const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);
                user.loginAttempts = undefined;
                user.password = undefined;

                sendToken(res, user, accessToken, refreshToken, `Welcome back, ${user.username}`, 200);    
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: POST
    // Path: /user/logout
    logout: async (req, res) => {
        try {

            await User.findByIdAndUpdate(req.user.id, { refreshToken: '' });
            const option = {
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
            };
    
            // clear cookies
            res
            .status(200)
            .clearCookie("accessToken", option)
            .clearCookie("refreshToken", option)
            .clearCookie("csrfSecret", option)
            .json({
                success: true,
                message: "Logged Out Successfully",
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }   
    },

    // Method: GET
    // Path: /user
    getUserReference: async (req, res) => {
        try {
            const users = await User.find().select('-password -refreshToken -verifyToken -passwordHistory -resetPasswordToken -resetPasswordExpires');
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
    
            // Pagination
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 10;
            const startIndex = (page - 1) * perPage;
            const endIndex = page * perPage;
            const total = users.length;
    
            // Create data for the current page
            const data = users.slice(startIndex, endIndex);
    
            return res.status(200).json({ items: data, page, perPage, total });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: GET
    // Path: /user/all
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('username email role experience createdAt');
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
    
            const total = users.length;
    
            return res.status(200).json({ items: users, total });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: GET
    // Path: /user/:id
    getUserById: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId).select('username email role experience createdAt isVerified -_id');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: GET
    // Path: /user/profile
    getProfile: async (req, res) => {
        try {
            const userId = req.user._id;
            console.log(req.user);
            const user = await User.findById(userId).select('username role experience createdAt');
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            return res.status(200).json({ user });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: GET
    // Path: /user/experience
    getExperienceAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('username experience role -_id');
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }

            const filterUsers = users.filter(user => user.role !== 'admin');
            const total = filterUsers.length;
            const items = filterUsers.map(user => {
                return { username: user.username, experience: user.experience };
            });
    
            return res.status(200).json({ items, total });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: PUT
    // Path: /user/profile
    updateProfile: async (req, res) => {
        try {
            const userId = req.user._id;
            const { username, password } = req.body;
            const user = await User.findById(userId).select('username password role experience createdAt _id');
            
            if (!user){
                return res.status(404).json({ message: 'User not found' });
            }
    
            // check if username has invalid characters
            if (username && !/^[a-zA-Z0-9]+$/.test(username)) {
                return res.status(400).json({ message: 'Username is invalid, only contain a-z, A-Z, 0-9', field: 'username' });
            }
    
            if (username && username.length < 3) {
                return res.status(400).json({ message: 'Username must be at least 3 characters', field: 'username' });
            }
    
            if (!password){
                return res.status(400).json({ message: "Required password"});
            }
    
            const isMatch = await user.isCorrectPassword(password);
            if (!isMatch){
                return res.status(400).json({ message: 'Incorrect old password' });
            }
    
            if (username){
                const existingUser = await User.findOne({ username: username });
                if (existingUser && existingUser._id.toString() !== userId){
                    return res.status(400).json({ message: 'Username already exists', field: 'username' });
                }
            }
    
            user.username = username;
            const updatedUser = await user.save();
            updatedUser.password = undefined;
            
            return res.status(200).json( updatedUser );
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: GET
    // Path: /user/verify-email/:token
    verifyEmail: async (req, res) => {
        try {
            const token = req.params.token;
            const user = await User.findOne({ verifyToken: token });
            if (!user) {
                console.log('Invalid token');
                return res.redirect(`${process.env.CLIENT_URL}/verify-email/failed`);
            }
            user.isVerified = true;
            user.verifyToken = '';
            await user.save();
            res.clearCookie('verificationToken');
            console.log('Email verified successfully');
            return res.redirect(`${process.env.CLIENT_URL}/verify-email/success`);
            
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: POST
    // Path: /user/resend-email
    resendEmail: async (req, res) => {
        try {
            const email = req.body.email;
            console.log(email);
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.isVerified) {
                return res.status(400).json({ message: 'Email already verified' });
            }

            let verificationToken = crypto.randomBytes(32).toString('hex');
            user.verifyToken = verificationToken;
            await user.save();
            res.cookie('verificationToken', verificationToken, { httpOnly: true, secure: true, sameSite: 'Lax', maxAge: 1000 * 60 * 60 * 2 });

            // send verification email
            const verificationUrl = `${process.env.SERVER_URL}/user/verify-email/${verificationToken}`;
            const html = `<p>Please click <a href="${verificationUrl}">here</a> to verify your email address.</p>`;
            console.log(html);
            await sendMail(email, 'Verify your email address', html);

            return res.status(200).json({ message: 'Verification email sent successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: PUT
    // Path: /user/change-password
    changePassword: async (req, res) => {

        try {
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const userId = req.user._id;
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'All fields are required' });
            }
    
            // check if old password is correct
            const user = await User.findById(userId);
            const isMatch = await user.isCorrectPassword(oldPassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect old password' });
            }
    
            // check new password length
            if (!validator.isStrongPassword(newPassword)) {
                return res.status(400).json({ message: 'Password is too weak' });
            }
    
            // check confirm password
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'Password does not match' });
            }

            // check new password is in the password history
            let isInPasswordHistory = false;
            for (const password of user.passwordHistory) {
                const isMatch = await bcrypt.compare(newPassword, password);
                if (isMatch) {
                    isInPasswordHistory = true;
                    break;
                }
            };

            if (isInPasswordHistory) {  
                return res.status(400).json({ message: 'Password has been used before' });
            }
            
            // update password
            user.password = newPassword;
            await user.save();
    
            return res.status(200).json({ message: 'Password changed successfully' });
    
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },


    // Method: POST
    // Path: /user/forgot-password
    forgotPassword: async (req, res) => {
        try {
            const start = Date.now(); 
            const FORGOT_PASSWORD_RESPONSE_DELAY = 3000;

            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }
    
            const user = await User.findOne({ email });
            const token = user ? crypto.randomBytes(32).toString('hex') : null;
    
            if (user && user.isVerified) {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 1000*60*20; // 20 minutes
                await user.save();
    
                const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
                const html = `<p>Please click <a href="${resetUrl}">here</a> to reset your password.</p>`;
                console.log(html);
                await sendMail(email, 'Reset your password', html);
            }
    
            // Calculate the time taken so far
            const timeTaken = Date.now() - start;
            const delay = Math.max(0, FORGOT_PASSWORD_RESPONSE_DELAY - timeTaken);

            // Add an artificial delay to equalize the response time
            setTimeout(() => {
                return res.status(200).json({ message: 'Reset link sent to your email' });
            }, delay);
    
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: POST
    // Path: /user/reset-password/:token
    resetPassword: async (req, res) => {
        try {
            const { password, confirmPassword } = req.body;
            const resetToken = req.params.token;
            if (!password || !confirmPassword) {
                return res.status(400).json({ message: 'All fields are required' });
            }
    
            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Password does not match' });
            }

            if (!validator.isStrongPassword(password)) {
                return res.status(400).json({ message: 'Password is too weak' });
            }
    
            const user = await User.findOne({
                resetPasswordToken: resetToken,
                resetPasswordExpires: { $gt: Date.now() }
            });
    
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }
    
            // check new password is in the password history
            let isInPasswordHistory = false;
            for (const oldPassword of user.passwordHistory) {
                const isMatch = await bcrypt.compare(password, oldPassword);
                if (isMatch) {
                    isInPasswordHistory = true;
                    break;
                }
            };
    
            if (isInPasswordHistory) {
                return res.status(400).json({ message: 'Password has been used before' });
            }

            // update password
            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            return res.status(200).json({ message: 'Password reset successfully' });
    
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: POST
    // Path: /user/validate-reset-token
    validateResetToken: async (req, res) => {
        const { token } = req.body;
        // console.log(token);
        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

            res.status(200).json({ message: 'Token is valid' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateExperience: async (req, res) => {
    
    },

    // Method: PUT
    // Path: /user/edit/:id
    adminEditUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const { isVerified, experience } = req.body;
            const user = await User.findOneAndUpdate(
                { _id: userId }, 
                { $set: { isVerified, experience } }, 
                { new: true, select: 'username email role experience createdAt isVerified -_id' } 
            );
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.password = undefined;
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: DELETE
    // Path: /user/users
    selfDeleteAccount: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.user._id);
            return res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: DELETE
    // Path: /user/delete/:id
    adminDeleteAccount: async (req, res) => {
        try {
            const userId = req.params.id;
            await User.findByIdAndDelete(userId);
            return res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: DELETE
    // Path: /user/deleteMany
    adminDeleteManyAccount: async (req, res) => {
        try {
            const userIds = req.body.ids;
            await User.deleteMany({ _id: { $in: userIds } });
            return res.status(200).json({ message: 'Accounts deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: POST
    // Path: /user/refresh-token
    refreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(403).json({ message: 'User not authenticated' });
            }
    
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decoded._id);
            if (!user) {
                return res.status(403).json({ message: 'User not authenticated' });
            }
    
            if (user.refreshToken !== refreshToken) {
                return res.status(403).json({ message: 'Refresh token not valid' });
            }
            // console.log("Old RefreshToken", user.refreshToken);
    
            const newAccessToken = await user.generateAccessToken();
            sendToken(res, user, newAccessToken, refreshToken, 'Token Refreshed Successfully', 200);
    
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: GET
    // Path: /user/check-login
    checkLogin: async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            if (!token) {
                return res.status(401).json({ message: 'You need to login' });
            }
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded._id).select('username email role isVerified experience createdAt -_id');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ user });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};

export default userController;

