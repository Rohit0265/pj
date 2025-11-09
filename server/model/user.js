import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    clerkId: { type: String, required: true, unique: true }, // Clerk's user ID
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }, ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;