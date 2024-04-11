import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendToken } from '../middlewares/auth/sendToken.js';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        return { accessToken, refreshToken };
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
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
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // check if password is correct
        const isMatch = await user.isCorrectPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect Email or Password' });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);
        // send token
        sendToken(res, user, accessToken, refreshToken, `Welcome back, ${user.username}`, 200);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
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
};

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken');
        if (!users) {
            return res.status(400).json({ message: 'User not found' });
        }
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(req.user);
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    
};

export const forgetPassword = async (req, res) => {

};

export const changePassword = async (req, res) => {

    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;
        console.log(userId);
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // check if old password is correct
        const user = await User.findById(userId);
        const isMatch = await user.isCorrectPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // update password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateExperience = async (req, res) => {
    
};

export const deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        return res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


