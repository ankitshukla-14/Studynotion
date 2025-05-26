const SubSection = require("../models/subSection");
const Section = require("../models/section");
const {uploadFileToCloudinary} = require("../utils/fileUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
    try{
        const {sectionId, title, description} = req.body;
        const video = req.files.video;

        if(!sectionId || !title || !description || !video) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        console.log("Reached step uploading at cloudinary")
        const uploadedVideo = await uploadFileToCloudinary(video, process.env.FOLDER_NAME);
        console.log(uploadedVideo);
        console.log("Uploaded on cloudinary")

        const newSubSection = await SubSection.create({
            title: title,
            timeDuration: `${uploadedVideo.duration}`,
            description: description,
            videoUrl: uploadedVideo.secure_url,
        });

        const updatedSection = await Section.findByIdAndUpdate(
            {
                _id: sectionId
            },
            {
                $push: {
                    subSection: newSubSection._id
                },
            },
            {
                new: true
            }
        ).populate("subSection").exec();

        return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            data: updatedSection,
        });

    } catch(error) {
        console.error("Error in creating sub-section", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

exports.updateSubSection = async (req, res) => {
    try{
        const {sectionId, subSectionId, title, description} = req.body;

        const subSection = await SubSection.findById(subSectionId);
        if(!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        if(title !== undefined) {
            subSection.title = title;
        }
        if(description !== undefined) {
            subSection.description = description;
        }
        if(req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadedVideo = await uploadFileToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadedVideo.secure_url
            subSection.timeDuration = `${uploadedVideo.duration}`
        }
        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate("subSection").exec();

        console.log("Updated section", updatedSection);

        return res.status(200).json({
            success: true,
            message: "Sub-section updated successfully",
            data: updatedSection,
        });

    } catch(error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        });
    }
}

exports.deleteSubSection = async (req, res) => {
    try{
        console.log("REQ body ", req.body)
        const {sectionId, subSectionId} = req.body;
        
        await Section.findByIdAndUpdate(
            {
                _id: sectionId
            },
            {
                $pull: {
                    subSection: subSectionId,
                },
            },
            {
                new: true,
            },
        );

        await SubSection.findByIdAndDelete(subSectionId);
        
        console.log("SUBSECTION DELETED")
        const updatedSection = await Section.findById(sectionId).populate("subSection").exec();
        console.log("UPDATED SECTION...", updatedSection)
        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection,
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in deleting SubSection",
            error: error.message,
        });
    }
}