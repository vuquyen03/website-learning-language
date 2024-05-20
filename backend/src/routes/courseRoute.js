import express from 'express';
import courseController from '../controllers/courseController.js';
import { verifyJWT, isAdmin } from '../middlewares/auth/auth.js';
import upload from '../middlewares/upload/multer.js';

const router = express.Router();

// CREATE COURSE
router.post('/', verifyJWT, isAdmin, upload.single('image'), courseController.createCourse);

// GET COURSES REFERENCE
router.get('/', courseController.getCoursesReference);

// GET ALL COURSES
router.get('/all', verifyJWT, courseController.getAllCourses);

// GET MANY COURSES
router.get('/many', courseController.getManyCourses);

// UPDATE COURSE BY ID
router.put('/edit/:id', verifyJWT, isAdmin, upload.single('image'), courseController.updateCourseById);

// DELETE COURSE BY ID
router.delete('/delete/:id', verifyJWT, isAdmin, courseController.deleteCourseById);

// DELETE MANY COURSES
router.delete('/deleteMany', verifyJWT, isAdmin, courseController.deleteManyCourses);

// GET COURSE BY ID
router.get('/:id', courseController.getCourseById);

export default router;