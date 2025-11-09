import Stripe from "stripe";
import Course from "../model/modelSchema.js";
import User from "../model/user.js";
import { Purchase } from "../model/purchase.js";
import { CourseProgress } from "../model/courseProgress.js";

export const getUserData = async(req, res) => {
    try {
        console.log("Request Object Keys:", Object.keys(req));

        const userIdFromAuth = req.userId; // Or req.auth.userId, etc.
        const user = await User.findById(userIdFromAuth);
        // const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//user enrolled courses


export const userEnrolledCourses = async(req, res) => {
    try {
        const userId = req.auth.userId;
        const userData = await User.findById(userId).populate('enrolledCourses')
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, enrolledCourses: userData.enrolledCourses })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


//now for payment gateway

// import Stripe from "stripe";
// import User from "../model/user.js";
// import Course from "../model/modelSchema.js";
// import { Purchase } from "../model/purchase.js";

export const purchaseCourse = async(req, res) => {
    try {
        const { courseId } = req.body;
        const origin = req.headers.origin;
        const userId = req.auth.userId;

        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res.json({ success: false, message: "Data Not Found" });
        }

        // 💰 Calculate amount properly as a number
        const amount =
            courseData.coursePrice -
            (courseData.discount * courseData.coursePrice) / 100;

        // 🧾 Save purchase record
        const newPurchase = await Purchase.create({
            courseId: courseData._id,
            userId,
            amount: Number(amount.toFixed(2)), // ✅ Ensure numeric value
            status: "pending",
        });

        console.log("🧾 New Purchase ID:", newPurchase._id);

        // ⚙️ Initialize Stripe
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [{
            price_data: {
                currency: process.env.CURRENCY.toLowerCase(),
                product_data: {
                    name: courseData.courseTitle,
                },
                unit_amount: Math.round(amount * 100), // ✅ Always integer (cents)
            },
            quantity: 1,
        }, ];

        // 🧠 Make sure metadata is a plain object with string values only
        const metadata = { purchaseId: String(newPurchase._id) };
        console.log("🎯 Sending metadata:", metadata);

        // ✅ Create checkout session
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}`,
            line_items,
            mode: "payment",
            metadata,
        });

        console.log(
            "✅ Created Stripe session:",
            session.id,
            "metadata:",
            session.metadata
        );

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("❌ purchaseCourse error:", error);
        res.json({ success: false, message: error.message });
    }
};


//update user course


export const updateUserCourseProgress = async(req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId, lectureId } = req.body
        const progressData = await CourseProgress.findOne({ userId, courseId })
        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' })
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        } else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }
        res.json({ success: true, message: 'Progress Updated' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const getUserCourseProgress = async(req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId, lectureId } = req.body
        const progressData = await CourseProgress.findOne({ userId, courseId })
        res.json({ success: true, progressData })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


//rating


export const addUserRating = async(req, res) => {
    const userId = req.auth.userId
    const { courseId, rating } = req.body
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'Invalid Details' })
    }

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Coursenot found' })
        }
        const user = await User.findById(userId)
        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not purchased course' })
        }
        const existingRating = courseRatings.findIndex(r => r.userId === userId)
        if (existingRating > -1) {
            course.courseRtings[existingRating].rating = rating;
        } else {
            course.courseRtings.push({ userId, rating });
        }
        await course.save();

        return res.json({ success: true, message: 'Rating Added' })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })

    }
}