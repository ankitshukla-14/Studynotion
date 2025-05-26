const Section = require("../models/section");
const Course = require("../models/course");
const SubSection = require("../models/subSection");


exports.createSection = async (req, res) => {
    try{
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: true,
                message: "Missing required properties",
            });
        }
        const newSection = await Section.create({sectionName});

        const updatedCourse = await Course.findByIdAndUpdate(
            {
                _id: courseId,
            },
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            {
                new: true,
            },
        )
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            data: updatedCourse,
        });
    } catch(error) {
        res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
    }
}

exports.updateSection = async (req, res) => {
    try{
        const {sectionName, sectionId, courseId} = req.body;

        const section = await Section.findByIdAndUpdate(
                            {
                                _id: sectionId
                            },
                            {
                                sectionName
                            },
                            {
                                new: true
                            },
                        );

        const course = await Course.findById(courseId)
                            .populate({
                                path: "courseContent",
                                populate: {
                                    path: "subSection",
                                },
                            })
                            .exec();
        
        return res.status(200).json({
            success: true,
            message: section,
            data: course,
        });
        
    } catch(error) {
        console.error("Error updating section", error);
        return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
    }
}

exports.deleteSection = async (req, res) => {
    try{
        const {sectionId, courseId} = req.body;
        await Course.findByIdAndUpdate(courseId,
            {
                $pull : {
                    courseContent: sectionId,
                },
            }
        );
        const section = await Section.findById(sectionId);
        console.log(sectionId, courseId);
        if(!section) {
            return res.status(404).json({
				success:false,
				message:"Section not Found",
			});
        }
        await SubSection.deleteMany({_id: {$in: section.subSection}});
        await Section.findByIdAndDelete(sectionId);

        const updatedCourse = await Course.findById(courseId)
                                    .populate({
                                        path:"courseContent",
                                        populate: {
                                            path: "subSection"
                                        },
                                    })
                                    .exec();
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: updatedCourse,
        });
    } catch(error) {
        console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
    }
}