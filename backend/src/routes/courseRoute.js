import express from 'express';
import { 
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} from '../controllers/courseController.js';

import { verifyJWT, isAdmin } from '../middlewares/auth/auth.js';


const router = express.Router();

// create course
router.post('/', createCourse);

// get all courses
router.get('/', getAllCourses);

// get course by id
router.get('/:id', getCourseById);

// update course
router.put('/edit/:id', verifyJWT, isAdmin, updateCourse);

// delete course
router.delete('/delete/:id', verifyJWT, isAdmin, deleteCourse);

export default router;