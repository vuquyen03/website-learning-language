import express from 'express';
import userController from '../controllers/userController.js';
import { verifyJWT, isAdmin } from '../middlewares/auth/auth.js';
import rateLimiter from '../middlewares/rateLimit/rate-limit.js';

const router = express.Router();

// REGISTER USER
router.post('/register', userController.register);

// LOGIN USER
router.post('/login', rateLimiter, userController.login);

// LOGOUT USER
router.post('/logout', verifyJWT, userController.logout);

// GET USER PROFILE
router.get('/profile', verifyJWT, userController.getProfile);

// UPDATE USER PROFILE
router.put('/profile', verifyJWT, userController.updateProfile);

// CHANGE PASSWORD
router.put('/change-password', verifyJWT, userController.changePassword);

// UPDATE EXPERIENCE
router.put('/experience', userController.updateExperience);

// REFRESH TOKEN
router.post('/refresh-token', userController.refreshToken);

// DETERMINE ROLE
router.get('/role', verifyJWT, userController.determineRole);

// GET EXPERIENCE 
router.get('/experience', verifyJWT, userController.getExperienceAllUsers);

// GET ALL USERS
router.get('/all', verifyJWT, isAdmin, userController.getAllUsers);

// CHECK LOGIN STATUS
router.get('/check-login', verifyJWT, userController.checkLogin);

// GET USER REFERENCE
router.get('/', verifyJWT, isAdmin, userController.getUserReference);

// DELETE USER
router.delete('/users', verifyJWT, userController.selfDeleteAccount);

// DELETE USER BY ADMIN
router.delete('/delete/:id', verifyJWT, isAdmin, userController.adminDeleteAccount);

// DELETE MANY USERS BY ADMIN
router.delete('/deleteMany', verifyJWT, isAdmin, userController.adminDeleteManyAccount);

// EDIT USER ROLE AND EXPERIENCE BY ADMIN
router.put('/edit/:id', verifyJWT, isAdmin, userController.adminChangeUserRoleAndExperience);

// GET USER BY ID
router.get('/:id', verifyJWT, isAdmin, userController.getUserById);

export default router;
