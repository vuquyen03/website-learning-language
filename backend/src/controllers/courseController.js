import Course from '../models/Course.js';
import Quiz from '../models/Quiz.js';

const courseController = {
    createCourse: async (req, res) => {
        try {
            const { courseTitle, description, estimatedTime } = req.body;
            const newCourse = new Course({ courseTitle, description, estimatedTime });
            await newCourse.save();

            if (req.body.quiz) {
                const quiz = await Quiz.find({ _id: { $in: req.body.quiz } });
                if (!quiz || quiz.length !== req.body.quiz.length) {
                    return res.status(404).json({ message: 'Quiz not found' });
                }
                await quiz.updateMany({ $push: { course: newCourse._id } });
            }

            res.status(201).json(newCourse);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getAllCourses: async (req, res) => {
        try {
            const courses = await Course.find().populate('quiz');
            if (!courses || courses.length === 0) {
                return res.status(404).json({ message: 'No courses found' });
            }

            const total = courses.length;
            return res.status(200).json({ items: courses, total });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getCoursesReference: async (req, res) => {
        try {
            const courses = await Course.find();
            if (!courses || courses.length === 0) {
                return res.status(404).json({ message: 'No courses found' });
            }

            // Pagination
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 10;
            const startIndex = (page - 1) * perPage;
            const endIndex = page * perPage;
            const total = courses.length;

            // Create data for the current page
            const data = courses.slice(startIndex, endIndex);

            return res.status(200).json({ items: data, page, perPage, total });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getCourseById: async (req, res) => {
        try {
            const courseId = req.params.id;
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
    
            return res.status(200).json(course);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getManyCourses: async (req, res) => {
        try {
            const courseIds = req.query.ids;
            // console.log("getManyCourses:", courseIds)
            if (!courseIds || courseIds.length === 0) {
                return res.status(400).json({ message: 'No course IDs provided' });
            }

            const courses = await Course.find({ _id: { $in: courseIds } }).select('courseTitle');
            if (!courses || courses.length === 0) {
                return res.status(404).json({ message: 'No courses found' });
            }

            return res.status(200).json({ items: courses });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    },

    updateCourseById: async (req, res) => {
        try {
            const courseId = req.params.id;
            const updateFields = req.body;
    
            const course = await Course.findOneAndUpdate(
                { _id: courseId },
                { $set: updateFields },
                { new: true }
            );
    
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
    
            await Quiz.updateMany(
                { course: course._id },
                { $pull: { course: course._id } }
            );
    
            if (updateFields.quiz && updateFields.quiz.length > 0) {
                await Quiz.updateMany(
                    { _id: { $in: updateFields.quiz } },
                    { $push: { course: course._id } }
                );
            }
    
            return res.status(200).json(course);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    deleteCourseById: async (req, res) => {
        try {
            const courseId = req.params.id;
    
            await Quiz.updateMany(
                { course: courseId }, // Tìm tất cả các quiz liên quan đến course
                { $pull: { course: courseId } }
            );
    
            await Course.findByIdAndDelete(courseId);
    
            return res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    deleteManyCourses: async (req, res) => {
        try {
            const courseIds = req.body.ids;
            if (!courseIds || courseIds.length === 0) {
                return res.status(400).json({ message: 'No course IDs provided' });
            }

            await Quiz.updateMany(
                { course: { $in: courseIds } },
                { $pullAll: { course: courseIds } }
            );

            await Course.deleteMany({ _id: { $in: courseIds } });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },
};

export default courseController;
