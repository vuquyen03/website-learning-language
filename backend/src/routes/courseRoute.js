import express from 'express';
import courseController from '../controllers/courseController.js';
import { verifyJWT, isAdmin } from '../middlewares/auth/auth.js';


const router = express.Router();

// CREATE COURSE
router.post('/', verifyJWT, isAdmin, courseController.createCourse);

// GET COURSES REFERENCE
router.get('/', courseController.getCoursesReference);

// GET ALL COURSES
router.get('/all', courseController.getAllCourses);

// GET MANY COURSES
router.get('/many', courseController.getManyCourses);

// UPDATE COURSE BY ID
router.put('/edit/:id', verifyJWT, isAdmin, courseController.updateCourseById);

// DELETE COURSE BY ID
router.delete('/delete/:id', verifyJWT, isAdmin, courseController.deleteCourseById);

// DELETE MANY COURSES
router.delete('/deleteMany', verifyJWT, isAdmin, courseController.deleteManyCourses);

// GET COURSE BY ID
router.get('/:id', courseController.getCourseById);

export default router;