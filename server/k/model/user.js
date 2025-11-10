import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    role: { type: String, default: "student" },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }, ],
}, { timestamps: true });

export default mongoose.model("User", userSchema);