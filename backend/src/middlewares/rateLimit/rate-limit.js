import { rateLimit } from 'express-rate-limit'
import { RateLimitError } from '../../core/error.response.js';

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    handler: (req, res) => {
        new RateLimitError({ message: 'Too many login attempts from this IP, please try again after 15 minutes', req }).send(res);
    },}
);

export const forgotPasswordRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    handler: (req, res) => {
        new RateLimitError({ message: 'Too many password reset attempts from this IP, please try again after 15 minutes', req }).send(res);
    },
});

export const registerRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    handler: (req, res) => {
        new RateLimitError({ message: 'Too many registration attempts from this IP, please try again after 15 minutes', req }).send(res);
    },
});