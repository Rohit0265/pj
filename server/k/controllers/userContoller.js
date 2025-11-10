import Stripe from "stripe";
import Course from "../model/modelSchema.js";
import User from "../model/user.js";
import { Purchase } from "../model/purchase.js";
import { CourseProgress } from "../model/courseProgress.js";

/* ==========================================================
   🧠 GET USER DATA (No optional chaining)
   ========================================================== */
export const getUserData = async(req, res) => {
    try {
        const clerkId =
            req && req.auth && req.auth.userId ? req.auth.userId : null;

        if (!clerkId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized: No Clerk ID" });
        }

        const user = await User.findOne({ clerkId: clerkId });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found in database" });
        }

        return res.status(200).json({ success: true, user });
    } catch (err) {
        console.error("getUserData error:", err.message);
        return res
            .status(500)
            .json({ success: false, message: "Server error: " + err.message });
    }
};

/* ==========================================================
   🎓 GET USER ENROLLED COURSES
   ========================================================== */
export const userEnrolledCourses = async(req, res) => {
    try {
        const clerkId =
            req && req.auth && req.auth.userId ? req.auth.userId : null;

        if (!clerkId) {
            return res.json({ success: false, message: "Unauthorized request" });
        }

        const user = await User.findOne({ clerkId: clerkId }).populate(
            "enrolledCourses"
        );
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            enrolledCourses: user.enrolledCourses,
        });
    } catch (error) {
        console.error("userEnrolledCourses error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

/* ==========================================================
   💳 PURCHASE COURSE
   ========================================================== */
export const purchaseCourse = async(req, res) => {
    try {
        const courseId = req.body ? req.body.courseId : null;
        const origin = req.headers ? req.headers.origin : null;
        const clerkId =
            req && req.auth && req.auth.userId ? req.auth.userId : null;

        if (!clerkId || !courseId) {
            return res.json({ success: false, message: "Missing data" });
        }

        const user = await User.findOne({ clerkId: clerkId });
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.json({ success: false, message: "Data not found" });
        }

        const amount =
            course.coursePrice - (course.discount * course.coursePrice) / 100;

        const newPurchase = await Purchase.create({
            courseId: course._id,
            userId: user._id,
            amount: Number(amount.toFixed(2)),
            status: "pending",
        });

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.create({
            success_url: origin + "/loading/my-enrollments",
            cancel_url: origin,
            line_items: [{
                price_data: {
                    currency: process.env.CURRENCY ?
                        process.env.CURRENCY.toLowerCase() :
                        "usd",
                    product_data: { name: course.courseTitle },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            }, ],
            mode: "payment",
            metadata: { purchaseId: String(newPurchase._id) },
        });

        return res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("purchaseCourse error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

/* ==========================================================
   📈 UPDATE USER COURSE PROGRESS
   ========================================================== */
export const updateUserCourseProgress = async(req, res) => {
    try {
        const clerkId =
            req && req.auth && req.auth.userId ? req.auth.userId : null;

        if (!clerkId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId: clerkId });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const courseId = req.body ? req.body.courseId : null;
        const lectureId = req.body ? req.body.lectureId : null;

        if (!courseId || !lectureId) {
            return res.json({ success: false, message: "Invalid input data" });
        }

        let progress = await CourseProgress.findOne({
            userId: user._id,
            courseId: courseId,
        });

        if (progress) {
            if (progress.lectureCompleted.includes(lectureId)) {
                return res.json({
                    success: true,
                    message: "Lecture already completed",
                });
            }
            progress.lectureCompleted.push(lectureId);
            await progress.save();
        } else {
            await CourseProgress.create({
                userId: user._id,
                courseId: courseId,
                lectureCompleted: [lectureId],
            });
        }

        return res.json({ success: true, message: "Progress updated" });
    } catch (error) {
        console.error("updateUserCourseProgress error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

/* ==========================================================
   📊 GET USER COURSE PROGRESS
   ========================================================== */
export const getUserCourseProgress = async(req, res) => {
    try {
        const clerkId =
            req && req.auth && req.auth.userId ? req.auth.userId : null;

        if (!clerkId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId: clerkId });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const courseId = req.body ? req.body.courseId : null;

        if (!courseId) {
            return res.json({ success: false, message: "Missing courseId" });
        }

        const progress = await CourseProgress.findOne({
            userId: user._id,
            courseId: courseId,
        });

        return res.json({ success: true, progress: progress });
    } catch (error) {
        console.error("getUserCourseProgress error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

/* ==========================================================
   ⭐ ADD USER RATING
   ========================================================== */
export const addUserRating = async(req, res) => {
    try {
        const clerkId =
            req && req.auth && req.auth.userId ? req.auth.userId : null;

        if (!clerkId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const courseId = req.body ? req.body.courseId : null;
        const rating = req.body ? req.body.rating : null;

        if (!courseId || !rating || rating < 1 || rating > 5) {
            return res.json({ success: false, message: "Invalid details" });
        }

        const user = await User.findOne({ clerkId: clerkId });
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.json({ success: false, message: "Data not found" });
        }

        if (!user.enrolledCourses.includes(courseId)) {
            return res.json({
                success: false,
                message: "User has not purchased this course",
            });
        }

        let existingIndex = -1;
        for (let i = 0; i < course.courseRatings.length; i++) {
            if (String(course.courseRatings[i].userId) === String(user._id)) {
                existingIndex = i;
                break;
            }
        }

        if (existingIndex > -1) {
            course.courseRatings[existingIndex].rating = rating;
        } else {
            course.courseRatings.push({ userId: user._id, rating: rating });
        }

        await course.save();

        return res.json({ success: true, message: "Rating added" });
    } catch (error) {
        console.error("addUserRating error:", error.message);
        res.json({ success: false, message: error.message });
    }
};