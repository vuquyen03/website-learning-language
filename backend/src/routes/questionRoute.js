import express from 'express';
import questionController from '../controllers/questionController.js';
import { verifyJWT, isAdmin } from '../middlewares/auth/auth.js';


const router = express.Router();

// CREATE QUIZ
router.post('/', questionController.createQuestion);

// GET ALL QUIZZES REFERENCE
router.get('/', questionController.getAllQuestionsReference);

// GET ALL QUIZZES
router.get('/all', questionController.getAllQuestions);

// GET MANY QUIZZES
router.get('/many', questionController.getManyQuestions);

// UPDATE QUIZ
router.put('/edit/:id', verifyJWT, isAdmin, questionController.updateQuestionById);

// DELETE QUIZ BY ID
router.delete('/delete/:id', verifyJWT, isAdmin, questionController.deleteQuestionById);

// DELETE MANY QUIZZES
router.delete('/deleteMany', verifyJWT, isAdmin, questionController.deleteManyQuestions);

// GET QUIZ BY ID
router.get('/:id', questionController.getQuestionById);

export default router;