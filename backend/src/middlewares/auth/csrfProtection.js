import Tokens from 'csrf';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const tokens = new Tokens();

const csrfMiddleware = (req, res, next) => {
    const csrfSecret = crypto.randomBytes(32).toString('hex');
    const csrfToken = tokens.create(csrfSecret);
    console.log('New csrfToken', csrfToken);
    console.log('New csrfSecret', csrfSecret);

    res.cookie('csrfSecret', csrfSecret, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(process.env.REFRESH_TOKEN_EXPIRY)), // Should match the refresh token expiry
    });

    res.locals.csrfToken = csrfToken;
    res.setHeader('X-CSRF-Token', csrfToken);
    next();
};

export const verifyCsrfToken = async (req, res, next) => {
    const csrfToken = req.headers['x-csrf-token'];
    const csrfSecret = req.cookies['csrfSecret'];

    if (!csrfToken || !csrfSecret || !tokens.verify(csrfSecret, csrfToken)) {
        console.log('Invalid CSRF token');
        return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    next();
};

export default csrfMiddleware;