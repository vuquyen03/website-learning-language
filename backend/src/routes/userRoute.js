import express from 'express';
import userController from '../controllers/userController.js';
import { verifyJWT, isAdmin } from '../middlewares/auth/auth.js';
import csurf from 'csurf';
import { loginRateLimiter, forgotPasswordRateLimiter } from '../middlewares/rateLimit/rate-limit.js';

const router = express.Router();
const csrfProtection = csurf({ cookie: true });

// REGISTER USER
router.post('/register', userController.register);

// LOGIN USER
router.post('/login', loginRateLimiter, userController.login);

// VERIFY EMAIL
router.get('/verify-email/:token', userController.verifyEmail);

// RESEND EMAIL
router.post('/resend-email', verifyJWT, userController.resendEmail);

// LOGOUT USER
router.post('/logout', verifyJWT, userController.logout);

// GET USER PROFILE
router.get('/profile', verifyJWT, userController.getProfile);

// UPDATE USER PROFILE
router.put('/profile', verifyJWT, userController.updateProfile);

// CHANGE PASSWORD
router.put('/change-password', verifyJWT, userController.changePassword);

// FORGOT PASSWORD
router.post('/forgot-password', forgotPasswordRateLimiter, userController.forgotPassword);

// RESET PASSWORD
router.post('/reset-password/:token', userController.resetPassword);

// VALIDATE RESET TOKEN
router.post('/validate-reset-token', userController.validateResetToken);

// UPDATE EXPERIENCE
router.put('/experience', userController.updateExperience);

// REFRESH TOKEN
router.post('/refresh-token', userController.refreshToken);

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
