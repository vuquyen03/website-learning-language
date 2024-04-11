import express from 'express';
import { 
    register,
    login,
    logout,
    getAllUser,
    getProfile,
    updateProfile,
    forgetPassword,
    changePassword,
    updateExperience
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

//delete user
router.delete('/dashboard', verifyJWT, isAdmin, deleteUser);

export default router;
