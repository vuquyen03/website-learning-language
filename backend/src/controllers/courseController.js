import Course from '../models/Course.js';

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, description, estimatedTime } = req.body;
        const newCourse = new Course({ courseTitle, description, estimatedTime });
        await newCourse.save();

        res.status(201).json(newCourse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllCourses = async (req, res) => {
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
};

export const getCourseById = async (req, res) => {
    
};

export const updateCourse = async (req, res) => {
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

        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        // await Quiz.updateMany(
        //     { courses: courseId }, // Tìm tất cả các quiz liên quan đến course
        //     { $pull: { courses: courseId } } // Loại bỏ liên kết với course
        // );

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

