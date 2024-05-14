import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendToken } from '../middlewares/auth/sendToken.js';
import bcrypt from 'bcrypt';
import GoogleRecaptcha from 'google-recaptcha';

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
    register: async (req, res) => {
        try {
            const { username, email, password, confirmPassword } = req.body;
            console.log(req.body);
            if (!username || !email || !password || !confirmPassword) {
                return res.status(400).json({ message: 'All fields are required' });
            }
    
            // check if user already exists
            const existingUser  = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: 'Username already exists', field: 'username' });
            }
    
            const existingEmail  = await User.findOne({ email });
            if (existingEmail ) {
                return res.status(400).json({ error: 'Email already exists', field: 'email' });
            }
    
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Password does not match' });
            }
    
            const newUser = new User({ username, email, password });
            await newUser.save(); 
            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser._id);
    
            // send token
            sendToken(res, newUser, accessToken, refreshToken ,"Registered Successfully", 201);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const recaptchaResponse = req.body['g-recaptcha-response'];
            // console.log(req.body)
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            console.log(`Request IP: ${ip}`);

            if (recaptchaResponse) {
                try {
                    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;

                    const recaptchaVerifyResponse = await fetch(recaptchaVerifyUrl, { method: 'POST' });
                    const recaptchaVerifyData = await recaptchaVerifyResponse.json();
                    // console.log(recaptchaVerifyData)

                    if (!recaptchaVerifyData.success) {
                        return res.status(400).json({ error: 'reCAPTCHA verification failed' });
                    }

                    continueLogin();
                } catch (error) {
                    console.log(error);
                    return res.status(400).json({ error: 'reCAPTCHA verification failed' });
                }
            } else {
                continueLogin();
            }

            async function continueLogin() {
                if (!email || !password) {
                    return res.status(400).json({ error: 'All fields are required' });
                }
    
                const user = await User.findOne({ email }).select('-refreshToken -passwordHistory');
                if (!user) {
                    return res.status(400).json({ error: 'Incorrect Email or Password' });
                }
    
                if (user.loginAttempts >= 5 && !recaptchaResponse) {
                    return res.status(400).json({ error: 'Please complete the reCAPTCHA' });
                }
    
                const isMatch = await user.isCorrectPassword(password);
                if (!isMatch) {
                    user.loginAttempts += 1;
                    await user.save();
                    return res.status(400).json({ error: 'Incorrect Email or Password' });
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

    logout: async (req, res) => {
        try {
            await User.findByIdAndUpdate(req.user.id, { refreshToken: '' });
            const option = {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            };
    
            // clear cookies
            res
            .status(200)
            .clearCookie("accessToken", option)
            .clearCookie("refreshToken", option)
            .json({
                success: true,
                message: "Logged Out Successfully",
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }   
    },

    getUserReference: async (req, res) => {
        try {
            const users = await User.find().select('-password -refreshToken');
            if (!users || users.length === 0) { // Check if users array is empty
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

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password -refreshToken -passwordHistory');
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
    
            const total = users.length;
    
            return res.status(200).json({ items: users, total });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId).select('-password -refreshToken -passwordHistory');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

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

    getExperienceAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password -refreshToken');
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

    determineRole: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password -refreshToken');
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            if (user.role === 'user') {
                return res.status(200).json({ message: 'You\'re user', role: 'user' });
            } else if (user.role === 'admin') {
                return res.status(200).json({ message: 'You\'re admin', role: 'admin' });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.user._id;
            const { username, password } = req.body;
            const user = await User.findById(userId).select('-refreshToken -passwordHistory -loginAttempts');
    
            if (!user){
                return res.status(404).json({ error: 'User not found' });
            }
    
            // check if username has invalid characters
            if (username && !/^[a-zA-Z0-9]+$/.test(username)) {
                return res.status(400).json({ error: 'Username is invalid, only contain a-z, A-Z, 0-9', field: 'username' });
            }
    
            if (username && username.length < 3) {
                return res.status(400).json({ error: 'Username must be at least 3 characters', field: 'username' });
            }
    
            if (!password){
                return res.status(400).json({ error: "Required password"});
            }
    
            const isMatch = await user.isCorrectPassword(password);
            if (!isMatch){
                return res.status(400).json({ error: 'Incorrect old password' });
            }
    
            if (username){
                const existingUser = await User.findOne({ username: username });
                if (existingUser && existingUser._id.toString() !== userId){
                    return res.status(400).json({ error: 'Username already exists', field: 'username' });
                }
            }
    
            user.username = username;
            const updatedUser = await user.save();
            updatedUser.password = undefined;
    
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

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
                return res.status(400).json({ error: 'Incorrect old password' });
            }
    
            // check new password length
            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }
    
            // check confirm password
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: 'Password does not match' });
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
                return res.status(400).json({ error: 'Password has been used before' });
            }
            
            // update password
            user.password = newPassword;
            await user.save();
    
            return res.status(200).json({ message: 'Password changed successfully' });
    
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    updateExperience: async (req, res) => {
    
    },

    adminChangeUserRoleAndExperience: async (req, res) => {
        try {
            const userId = req.params.id;
            const { role, experience } = req.body;
            const user = await User.findOneAndUpdate(
                { _id: userId }, 
                { $set: { role, experience } }, 
                { new: true } 
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

    selfDeleteAccount: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.user._id);
            return res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    adminDeleteAccount: async (req, res) => {
        try {
            const userId = req.params.id;
            await User.findByIdAndDelete(userId);
            return res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    adminDeleteManyAccount: async (req, res) => {
        try {
            const userIds = req.body.ids;
            await User.deleteMany({ _id: { $in: userIds } });
            return res.status(200).json({ message: 'Accounts deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

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

    checkLogin: async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            if (!token) {
                return res.status(401).json({ message: 'You need to login' });
            }
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded._id).select('-password -refreshToken -passwordHistory -loginAttempts');
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

