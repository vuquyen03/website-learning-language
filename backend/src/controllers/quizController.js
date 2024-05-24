import Course from "../models/Course.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

const quizController = {
    
    // Method: POST
    // Path: /quiz/
    createQuiz: async (req, res) => {
        try {
            const { title, course, description } = req.body;

            const newQuiz = new Quiz({ title, course, description });
            await newQuiz.save();

            if (course) {
                await Course.updateMany(
                    { _id: { $in: course } },
                    { $push: { quiz: newQuiz._id } }
                );
            }

            res.status(201).json(newQuiz);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: GET
    // Path: /quiz/
    getAllQuizzes: async (req, res) => {
        try {
            const quizzes = await Quiz.find().populate('course', 'courseTitle');
            if (!quizzes || quizzes.length === 0) {
                return res.status(404).json({ message: 'No quizzes found' });
            }

            // Pagination
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 10;
            const startIndex = (page - 1) * perPage;
            const endIndex = page * perPage;
            const total = quizzes.length;

            // Create data for the current page
            const data = quizzes.slice(startIndex, endIndex);

            return res.status(200).json({ items: data, page, perPage, total });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Method: GET
    // Path: /quiz/many
    getManyQuizzes: async (req, res) => {
        try {
            const quizIds = req.query.ids;
            if (!quizIds || quizIds.length === 0) {
                return res.status(400).json({ message: 'No quiz IDs provided' });
            }

            const quizzes = await Quiz.find({ _id: { $in: quizIds } }).populate('course', 'courseTitle');
            if (!quizzes || quizzes.length === 0) {
                return res.status(404).json({ message: 'No quizzes found' });
            }

            return res.status(200).json({ items: quizzes });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: GET
    // Path: /quiz/:id
    getQuizById: async (req, res) => {
        try {
            const quizId = req.params.id;
            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            return res.status(200).json(quiz);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: GET
    // Path: /quiz/questions/:id
    getQuestionsByQuizId: async (req, res) => {
        try {
            const quizId = req.params.id;
            const quiz = await Quiz.findById(quizId).populate('question').select('title question');
            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }
            
            return res.status(200).json(quiz);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: PUT
    // Path: /quiz/edit/:id
    updateQuizById: async (req, res) => {
        try {
            const quizId = req.params.id;
            const updateFields = req.body;

            const quiz = await Quiz.findOneAndUpdate(
                { _id: quizId },
                { $set: updateFields },
                { new: true }
            );
            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            await Course.updateMany(
                { quiz: quizId },
                { $pull: { quiz: quizId } }
            );

            if (updateFields.course && updateFields.course.length > 0) {
                await Course.updateMany(
                    { _id: { $in: updateFields.course } },
                    { $push: { quiz: quizId } }
                );
            }

            return res.status(200).json(quiz);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: DELETE
    // Path: /quiz/delete/:id
    deleteQuizById: async (req, res) => {
        try {
            const quizId = req.params.id;

            await Course.updateMany(
                { quiz: quizId },
                { $pull: { quiz: quizId } }
            );

            await Question.updateMany(
                { quiz: quizId },
                { $unset: { quiz: 1 } }
            );

            await Quiz.findByIdAndDelete(quizId);
            return res.status(200).json({ message: 'Quiz deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // Method: DELETE
    // Path: /quiz/deleteMany
    deleteManyQuizzes: async (req, res) => {
        try {
            const quizIds = req.body.ids;

            if (!Array.isArray(quizIds)) {
                quizIds = [quizIds];
            }
            console.log(quizIds);
            if (!quizIds || quizIds.length === 0) {
                return res.status(400).json({ message: 'No quiz IDs provided' });
            }

            await Course.updateMany(
                { quiz: { $in: quizIds } },
                { $pull: { quiz: { $in: quizIds } } }
            );

            await Question.updateMany(
                { quiz: { $in: quizIds } },
                { $unset: { quiz: 1 } }
            );

            await Quiz.deleteMany({ _id: { $in: quizIds } });

            return res.status(200).json({ message: 'Quizzes deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};

export default quizController;
