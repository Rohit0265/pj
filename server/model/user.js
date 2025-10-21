import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    _id: { type: string, required: true },
    name: { type: String, required: true },
    email: {
        type: string,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    enrolledCourses: [{
        type: mongo.Schema.Types.ObjectId,
        ref: 'Course'
    }],

}, { timestamps: true })


const user = mongoose.model('user', userSchema);

export default user;