import mongoose from "mongoose";

// key parts added/changed
const userSchema = new mongoose.Schema({
    _id: { type: String }, // <--- ensure Mongo _id is a string
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    role: { type: String, default: "student" },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
}, { timestamps: true });

// Ensure mongo _id equals clerkId so string refs work
userSchema.pre('save', function(next) {
    if (this.clerkId && (!this._id || this._id !== this.clerkId)) {
        this._id = this.clerkId;
    }
    next();
});

export default mongoose.model("User", userSchema);