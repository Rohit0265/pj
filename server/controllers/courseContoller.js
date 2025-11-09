import { messageInRaw } from "svix";
import Course from "../model/modelSchema.js";
import User from "../model/user.js";
import { Purchase } from "../model/purchase.js";

//get all courses


export const getAllcourse = async(req, res) => {

    try {
        const courses = await Course.find({ isPublished: true }).select(['-courseContent', '-enrolledStudents']).populate({ path: 'educator' })

        res.json({ success: true, courses })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

//get course by id

export const getCourseId = async(req, res) => {
    const { id } = req.params;

    try {
        const courseData = await Course.findById(id).populate({ path: "educator" });

        if (!courseData) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Remove lecture URL if preview is not free
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) { // make sure your schema uses isPreviewFree
                    lecture.lectureUrl = "";
                }
            });
        });

        res.json({ success: true, course: courseData }); // ✅ standardized key name
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};