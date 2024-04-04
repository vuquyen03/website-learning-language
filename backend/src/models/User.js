import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

// create User Schema with username, email, password, createAt, experience
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/, 'Must match an email address!'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    experience: {
        type: Number,
        default: 0,
    },
    refreshToken: {
        type: String,
        default: '',
    },
});

// Hash password before save
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        // Encrypt password with salt
        this.password = await bcrypt.hash(this.password, salt); 
    }
    next();
});

// Compare input password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
// generate access token
userSchema.methods.generateAccessToken = function () {
    const payload = { _id: this._id, email: this.email };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}
// generate refresh token
userSchema.methods.generateRefreshToken = function () {
    const payload = { _id: this._id, email: this.email };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });   
}

const User = model('User', userSchema)

export default User;
