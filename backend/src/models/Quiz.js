import { Schema, model } from "mongoose";

const quizSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
});

const Quiz = model("Quiz", quizSchema);
export default Quiz;