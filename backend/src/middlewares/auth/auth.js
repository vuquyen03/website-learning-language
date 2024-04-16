import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import * as dotenv from 'dotenv';

dotenv.config();

const secret = process.env.ACCESS_TOKEN_SECRET;

const verifyJWT = async (req, res, next) => {
    try {
        const token = await req.cookies?.accessToken || req.headers['authorization']?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'You need to login' });
        }
        const decoded = jwt.verify(token, secret);
        // Query user by id in database without password and refreshToken
        const user = await User.findById(decoded._id).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next()   

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized' });
    }
    next();
}

export { verifyJWT, isAdmin }