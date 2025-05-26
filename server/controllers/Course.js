const Course = require("../models/course");
const User = require("../models/user");
const Category = require("../models/category");
const Section = require("../models/section");
const SubSection = require("../models/subSection");
const {uploadFileToCloudinary} = require("../utils/fileUploader");
const {convertSecondsToDuration} = require("../utils/secToDuration");
const CourseProgress = require("../models/courseProgress");
const RatingAndReview = require("../models/ratingAndReview");
const courseProgress = require("../models/courseProgress");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

exports.createCourse = async (req, res) => {
    try{
        const userId = req.user.id;
        let {courseName, courseDescription, whatYouWillLearn, price,
            tag: _tag, category, status, instructions: _instructions,
        } = req.body;
        const thumbnail = req.files.thumbnailImage;

        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);

        console.log("tag", tag);
        console.log("instructions", instructions);

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length || !thumbnail || !instructions.length) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
              })
        }
        if(!status || status === undefined) {
            status = "Draft";
        }
        const instructorDetails = await User.findById(userId, 
            {accountType: "Instructor"}
        );
        if(!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            });
        }
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
              success: false,
              message: "Category Details Not Found",
            });
        }
        
        console.log("a mcdms d")
        const thumbnailImage = await uploadFileToCloudinary(thumbnail, process.env.FOLDER_NAME);
        console.log("THUMBNAIL ",thumbnailImage);
        const newCourse = await Course.create({
            courseName, 
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions,
        })
        console.log("NEW COURSE...", newCourse)



        const userDetails = await User.findByIdAndUpdate(
            {
                _id: userId,
            },
           {
            $push: {
                courses: newCourse._id,
            },      
           },
           {
            new: true,
           }
        )
        const categoryDetails2 = await Category.findByIdAndUpdate(
            {_id: category},
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            {
                new: true,
            },
        )
        console.log("HEREEEEEEEE", categoryDetails2)
        // Return the new course and a success message
        return res.status(200).json({
                success: true,
                data: newCourse,
                user: userDetails,
                category: categoryDetails2,
                message: "Course Created Successfully",
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
}

exports.editCourse = async (req, res) => {
    try{
        const {courseId} = req.body;
        const updates = req.body;
        const course = await Course.findById(courseId)

        if(!course) {
            return res.status(400).json({
                success: false,
                error: "Course not found"});
        }

        // if thumbnail image is found
        if(req.files) {
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadFileToCloudinary(thumbnail, process.env.FOLDER_NAME);
            course.thumbnail = thumbnailImage.secure_url;
        }
        // updating only fields that are present in req body
        for(const key in updates) {
            if(updates.hasOwnProperty(key)) {
                if(key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                }
                else {
                    course[key] = updates[key];
                }
            }
        }
        await course.save();
        const updatedCourse = await Course.findOne({_id: courseId})
                                    .populate(
                                        {
                                            path: "instructor",
                                            populate: {
                                                path: "additionalDetails",
                                            },
                                        }
                                    )
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path: "courseContent",
                                        populate: {
                                            path: "subSection",
                                            },
                                    })
                                    .exec();
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

exports.getAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.find(
                        {
                            status: Published,
                            select: "coursName price thumbnail instructor ratingAndReview studenEnrolled",
                        },
                        
                    )
                    .populate("instructor")
                    .exec();

        return res.status(200).json({
            success: true,
            data: allCourses,
        });

    } catch(error) {
        console.error(error);
        return res.status(404).json({
            success: false,
            error: error.message,
        });
    }
}

exports.getCourseDetails = async (req, res) => {
    try{
        const {courseId} = req.body;
        const courseDetails = await Course.findOne({_id: courseId})
                                    .populate({
                                        path: "instructor",
                                        populate: {
                                            path: "additionalDetails",
                                        },
                                    })
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path: "courseContent",
                                        populate: {
                                            path: "subSection",
                                        },
                                    })
                                    .exec();

    if(!courseDetails) {
        return res.status(404).json({
            success: false,
            message:"Could not find course",
        });
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    console.log("total time..", totalDurationInSeconds)
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
    
    console.log("total ", totalDuration);

    return res.status(200).json({
        success: true,
        data: {
            courseDetails,
            totalDuration
        },
    });
    
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getInstructorCourses = async (req, res) => {
    try{
        const instructorId = req.user.id;

        const instructorCourses = await Course.find({instructor: instructorId})
                                        .sort({createdAt: -1});
                                    
        return res.status(200).json({
            success: true,
            data: instructorCourses,
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteCourse = async (req, res) => {
    try{
        const userId = req.user.id;
        const {courseId} = req.body;

        const course = await Course.findById(courseId);
        if(!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        // unenroll students
        for(const studentId of course.studentEnrolled) {
            await User.findByIdAndUpdate(
                {
                    _id: studentId,
                },
                {
                    $pull: {
                        courses: courseId,
                    },
                },
                {
                    new: true,
                },
            );
        }    
        
        await CourseProgress.deleteMany({
            courseId: courseId,
        })
        
        // delete sections and subsection
        for(const sectionId of course.courseContent) {
            const section = await Section.findById(sectionId);
            if(section) {
                for(const subSectionId of section.subSection) {
                    await SubSection.findByIdAndDelete(subSectionId);
                }
            }
            await Section.findByIdAndDelete(sectionId);            
        }
        // remove it from category
        await Category.findByIdAndUpdate(
            {
                _id: course.category,
            },
            {
                $pull: {
                    courses: courseId,
                },
            },
            {
                new: true,
            },
        );
        // remove it from instructor courses
        await User.findByIdAndUpdate(
            {
                _id: userId,
            },
            {
                $pull: {
                    courses: courseId,
                },
            },
            {
                new: true,
            },
        );

        await RatingAndReview.deleteMany({
            course: courseId
        })

        // delete course
        await Course.findByIdAndDelete(courseId);
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getFullCourseDetails = async (req, res) => {
    try {
        const userId = req.user.id
        const {courseId} = req.body

        let course = await Course.findById(courseId)
                            .populate({
                                path: "instructor",
                                populate: {
                                    path: "additionalDetails"
                                }
                            })
                            .populate("category")
                            .populate("ratingAndReviews")
                            .populate({
                                path: "courseContent",
                                populate: {
                                    path: "subSection"
                                }
                            })
                            .exec()
        
        if(!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        course = course.toObject()

        let totalDurationInSeconds = 0
        let totalVideos = 0
        course.courseContent.forEach((section) => {
            section.subSection.forEach((video) => {
                totalDurationInSeconds += parseInt(video.timeDuration)
                totalVideos++
            })
        })

        course.totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        course.totalLectures = totalVideos

        const courseProgress = await CourseProgress.findOne({
            userId: userId,
            courseId: courseId
        })
        
        course.completedLectures = courseProgress.completedVideos
        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            data: course
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.deleteAllCourses = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId) 
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        for(const courseId of user.courses) {
            console.log("deleting course")
            const course = await Course.findById(courseId);
            if(!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }
            // unenroll students
            for(const studentId of course.studentEnrolled) {
                await User.findByIdAndUpdate(
                    {
                        _id: studentId,
                    },
                    {
                        $pull: {
                            courses: courseId,
                        },
                    },
                    {
                        new: true,
                    },
                );
            }    
            
            await CourseProgress.deleteMany({
                courseId: courseId,
            })
            
            // delete sections and subsection
            for(const sectionId of course.courseContent) {
                const section = await Section.findById(sectionId);
                if(section) {
                    for(const subSectionId of section.subSection) {
                        await SubSection.findByIdAndDelete(subSectionId);
                    }
                }
                await Section.findByIdAndDelete(sectionId);            
            }
            // remove it from category
            await Category.findByIdAndUpdate(
                {
                    _id: course.category,
                },
                {
                    $pull: {
                        courses: courseId,
                    },
                },
                {
                    new: true,
                },
            );
            // remove it from instructor courses
            await User.findByIdAndUpdate(
                {
                    _id: userId,
                },
                {
                    $pull: {
                        courses: courseId,
                    },
                },
                {
                    new: true,
                },
            );

            await RatingAndReview.deleteMany({
                course: courseId
            })

            // delete course
            await Course.findByIdAndDelete(courseId);
        }
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });


    } catch(error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Courses cannnot be deleted"
        })
    }
}