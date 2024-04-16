import dotenv from 'dotenv';
dotenv.config();

// Send token to the client
export const sendToken = async (res, user, accessToken, refreshToken , message, statusCode = 200) => {

    await res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * parseInt(process.env.ACCESS_TOKEN_EXPIRY)), // accessToken is used during minutes
    });

    await res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(process.env.REFRESH_TOKEN_EXPIRY)), // refreshToken is used during days 
    });
    res.status(statusCode).json({ accessToken, refreshToken, user, message });
};