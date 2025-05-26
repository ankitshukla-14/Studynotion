const CourseProgress = require("../models/courseProgress")
const SubSection = require("../models/subSection")


exports.updateCourseProgress = async (req, res) => {
    try {
        const {courseId, subSectionId} = req.body
        const userId = req.user.id

        const subSection = await SubSection.findById(subSectionId)
        if(!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found"
            })
        }

        const courseProgress = await CourseProgress.findOne(
            {
                courseId: courseId,
                userId: userId
            }
        )

        if(!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course progress not found"
            })
        }

        if(courseProgress.completedVideos.includes(subSectionId)) {
            return res.status(400).json({
                success: false,
                message: "Lecture already completed"
            })
        }
        
        courseProgress.completedVideos.push(subSectionId)
        await courseProgress.save()

        return res.status(200).json({
            success: true,
            message: "Course Updated successfully",
            data: courseProgress
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}