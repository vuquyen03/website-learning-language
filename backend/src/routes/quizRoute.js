import express from 'express';
import quizController from '../controllers/quizController.js';
import { verifyJWT, isAdmin } from '../middlewares/auth/auth.js';


const router = express.Router();

// CREATE QUIZ
router.post('/', verifyJWT, isAdmin, quizController.createQuiz);

// GET ALL QUIZZES
router.get('/', quizController.getAllQuizzes);

// GET MANY QUIZZES
router.get('/many', quizController.getManyQuizzes);

// UPDATE QUIZ BY ID
router.put('/edit/:id', verifyJWT, isAdmin, quizController.updateQuizById);

// DELETE QUIZ BY ID
router.delete('/delete/:id', verifyJWT, isAdmin, quizController.deleteQuizById);

// DELETE MANY QUIZZES
router.delete('/deleteMany', verifyJWT, isAdmin, quizController.deleteManyQuizzes);

// GET QUIZ BY ID
router.get('/:id', quizController.getQuizById);

export default router;