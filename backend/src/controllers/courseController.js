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
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourse = async (req, res) => {
    
};

export const updateCourse = async (req, res) => {

};

export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.remove();
        return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

