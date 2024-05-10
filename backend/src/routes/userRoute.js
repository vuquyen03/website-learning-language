import express from 'express';
import { 
    register,
    login,
    logout,
    getUserReference,
    getAllUsers,
    getProfile,
    getUserById,
    determineRole,
    updateProfile,
    forgetPassword,
    changePassword,
    updateExperience,
    selfDeleteAccount,
    adminDeleteAccount,
    adminDeleteManyAccount,
    adminChangeUserRoleAndExperience,
    refreshToken,
    checkLogin
} from '../controllers/userController.js';
import { verifyJWT, isAdmin } from '../middlewares/auth/auth.js';

const router = express.Router();

// REGISTER USER
router.post('/register', register);

// LOGIN USER
router.post('/login', login);

// LOGOUT USER
router.post('/logout', verifyJWT, logout);

// GET USER PROFILE
router.get('/profile', verifyJWT, getProfile);

// UPDATE USER PROFILE
router.put('/profile', verifyJWT, updateProfile);

// FORGET PASSWORD
router.post('/forget-password', forgetPassword);

// CHANGE PASSWORD
router.put('/change-password', verifyJWT, changePassword);

// UPDATE EXPERIENCE
router.put('/experience', updateExperience);

// REFRESH TOKEN
router.post('/refresh-token', refreshToken);

// DETERMINE ROLE
router.get('/role', verifyJWT, determineRole);

// GET ALL USERS
router.get('/all', verifyJWT, getAllUsers);

// CHECK LOGIN STATUS
router.get('/check-login', verifyJWT, checkLogin);

// GET USER REFERENCE
router.get('/', verifyJWT, isAdmin, getUserReference);

// DELETE USER
router.delete('/users', verifyJWT, selfDeleteAccount);

// DELETE USER BY ADMIN
router.delete('/delete/:id', verifyJWT, isAdmin, adminDeleteAccount);

// DELETE MANY USERS BY ADMIN
router.delete('/deleteMany', verifyJWT, isAdmin, adminDeleteManyAccount);

// EDIT USER ROLE AND EXPERIENCE BY ADMIN
router.put('/edit/:id', verifyJWT, isAdmin, adminChangeUserRoleAndExperience);

// GET USER BY ID
router.get('/:id', verifyJWT, isAdmin, getUserById);

export default router;
