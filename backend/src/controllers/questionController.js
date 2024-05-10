import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";

const questionController = {
    createQuestion: async (req, res) => {
        try {
            const { question, correctOption, incorrectOptions } = req.body;
            const newQuestion = new Question({ question, correctOption, incorrectOptions });
            await newQuestion.save();

            res.status(201).json(newQuestion);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getAllQuestionsReference: async (req, res) => {
        try {
            const questions = await Question.find();
            if (!questions || questions.length === 0) {
                return res.status(404).json({ message: 'No questions found' });
            }

            // Pagination
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 10;
            const startIndex = (page - 1) * perPage;
            const endIndex = page * perPage;
            const total = questions.length;

            // Create data for the current page
            const data = questions.slice(startIndex, endIndex);

            return res.status(200).json({ items: data, page, perPage, total });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllQuestions: async (req, res) => {
        try {
            const questions = await Question.find().populate('quiz', 'title');
            if (!questions || questions.length === 0) {
                return res.status(404).json({ message: 'No questions found' });
            }

            return res.status(200).json(questions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getManyQuestions: async (req, res) => {
        try {
            const questionIds = req.query.ids;
            if (!questionIds || questionIds.length === 0) {
                return res.status(400).json({ message: 'No question IDs provided' });
            }

            const questions = await Question.find({ _id: { $in: questionIds } });
            if (!questions || questions.length === 0) {
                return res.status(404).json({ message: 'No questions found' });
            }

            return res.status(200).json({ items: questions });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getQuestionById: async (req, res) => {
        try {
            const questionId = req.params.id;
            const question = await Question.findById(questionId);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            return res.status(200).json(question);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    updateQuestionById: async (req, res) => {
        try {
            const questionId = req.params.id;
            const updateFields = req.body;

            const question = await Question.findOneAndUpdate(
                { _id: questionId },
                { $set: updateFields },
                { new: true }
            );
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            await Quiz.updateMany(
                { question: questionId },
                { $pull: { question: questionId } }
            );

            if (updateFields.quiz) {
                await Quiz.findOneAndUpdate(
                    { _id: updateFields.quiz },
                    { $push: { question: questionId } }
                );
            }

            return res.status(200).json(question);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    deleteQuestionById: async (req, res) => {
        try {
            const questionId = req.params.id;
            const question = await Question.findByIdAndDelete(questionId);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            await Quiz.updateMany(
                { question: questionId },
                { $pull: { question: questionId } }
            );

            return res.status(200).json({ message: 'Question deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    deleteManyQuestions: async (req, res) => {
        try {
            const questionIds = req.body.ids;
            if (!questionIds || questionIds.length === 0) {
                return res.status(400).json({ message: 'No question IDs provided' });
            }
    
            await Quiz.updateMany(
                { question: { $in: questionIds } },
                { $pull: { question: { $in: questionIds } } }
            );
    
            await Question.deleteMany({ _id: { $in: questionIds } });
    
            return res.status(200).json({ message: 'Questions deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export default questionController;

