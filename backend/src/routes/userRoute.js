import express from 'express';
import { 
    register,
    login,
    logout,
    getAllUser,
    getProfile,
    determineRole,
    updateProfile,
    forgetPassword,
    changePassword,
    updateExperience,
    selfDeleteAccount,
    adminDeleteAccount,
    refreshToken,
    checkLogin
} from '../controllers/userController.js';
import { verifyJWT, isAdmin } from '../middlewares/auth/auth.js';

const router = express.Router();

// register user
router.post('/register', register);

// login user
router.post('/login', login);

// logout user
router.post('/logout', verifyJWT, logout);

// get all users
router.get('/', getAllUser);

// get user profile
router.get('/profile', verifyJWT, getProfile);

// update user profile
router.put('/profile', updateProfile);

// forget password
router.post('/forget-password', forgetPassword);

// change password
router.put('/change-password', verifyJWT, changePassword);

// update experience
router.put('/experience', updateExperience);

// refresh token
router.post('/refresh-token', refreshToken);

// check login status
router.get('/check-login', verifyJWT, checkLogin);

// delete user
router.delete('/users', verifyJWT, selfDeleteAccount);

// delete user by admin
router.delete('/delete/:id', verifyJWT, isAdmin, adminDeleteAccount);

// determine Role
router.get('/role', verifyJWT, determineRole);

// edit user by admin
router.put('/edit/:id', verifyJWT, isAdmin, updateProfile);


export default router;
