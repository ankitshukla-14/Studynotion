const { default: mongoose } = require("mongoose");
const Profile = require("../models/Profile");
const User = require("../models/user");
const Course = require("../models/course");
const CourseProgress = require("../models/courseProgress");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const RatingAndReview = require("../models/ratingAndReview");
const Section = require("../models/section");
const SubSection = require("../models/subSection");
const Category = require("../models/category");


exports.updateProfile = async (req, res) => {
    try{
        const {
            firstName = "",
            lastName = "",
            dateOfBirth = "",
            about = "",
            contactNumber,
            gender = ""
        } = req.body;
        const id = req.user.id;

        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails);

        userDetails.firstName = firstName
        userDetails.lastName = lastName

        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        profile.gender = gender;

        await userDetails.save()
        await profile.save();

        const updatedUserDetails = await User.findById(id)
                                    .populate("additionalDetails")
                                    .exec();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUserDetails,
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteAccount = async (req, res) => {

    try {
        const userId = req.user.id;
        const userDetails = await User.findById(userId);

        await Profile.findByIdAndDelete({
            _id: new mongoose.Types.ObjectId(userDetails.additionalDetails)
        })

        if(userDetails.accountType === "Instructor") {
            console.log("User is instructor")
            
            for(const course of userDetails.courses) {
                let courseDetails = await Course.findById(course)
                console.log("derolling students")
                for(const studentId of courseDetails.studentEnrolled) {
                    await User.findByIdAndUpdate(
                        {
                            _id: studentId,
                        },
                        {
                            $pull: {
                                courses: course,
                            },
                        },
                        {
                            new: true,
                        },
                    );
                }    
                console.log("deleting courseProgresses of students")     
                await CourseProgress.deleteMany({
                    courseId: course,
                })
                
                // delete sections and subsection
                console.log("deleting sections and subsections of courses ")
                for(const sectionId of courseDetails.courseContent) {
                    const section = await Section.findById(sectionId);
                    if(section) {
                        for(const subSectionId of section.subSection) {
                            await SubSection.findByIdAndDelete(subSectionId);
                        }
                    }
                    await Section.findByIdAndDelete(sectionId);            
                }
                // remove it from category
                console.log("removing course from category")
                await Category.findByIdAndUpdate(
                    {
                        _id: courseDetails.category,
                    },
                    {
                        $pull: {
                            courses: course,
                        },
                    },
                    {
                        new: true,
                    },
                );
                // remove it from instructor courses
                console.log("deleting ratings and reviews of this course")
                await RatingAndReview.deleteMany({
                    course: course
                })
        
                // delete course
                console.log("deleting course")
                await Course.findByIdAndDelete(course);
            }  
        } else {
            for(const course of userDetails.courses) {
                console.log("derolling student")
                await Course.findByIdAndUpdate(
                    {
                        _id: course
                    },
                    {
                        $pull: {
                            studentEnrolled: userId
                        }
                    },
                    {
                        new: true
                    }
                )
            }
            console.log("deleting course progresses")
            await CourseProgress.deleteMany({userId: userId});
            console.log("deleting reviews")
            await RatingAndReview.deleteMany({user: userId});
        } 

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        }) 

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Account deletion failed"
        })
    }















//     try{
//         const id = req.user.id;

//         const user = await User.findById(id);
//         if(!user) {
//             return res.status(404).json({
//                 success: false.valueOf,
//                 message: "User not found",
//             });
//         }

//         await Profile.findByIdAndDelete({
//             _id: new mongoose.Types.ObjectId(user.additionalDetails)
//         });

//         for(const courseId of user.courses) {
//             await Course.findByIdAndUpdate(
//                 courseId,
//                 {
//                     $pull: {
//                         studentEnrolled: id,
//                     },
//                 },
//                 {
//                     new: true
//                 },
//             );
//         }

//         await deleteC
//         await CourseProgress.deleteMany({userId: id});

//         await RatingAndReview.deleteMany({userId: id});

//         await User.findByIdAndDelete(id);

//         return res.status(200).json({
//             success: true,
//             message: "User deleted successfully",
//         });

//     } catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             error: error.message,
//         });
//     }
}

exports.getAllUserDetails = async (req, res) => {
    try{
        const userId = req.user.id;
        const userDetails = await User.findById(userId)
                                  .populate("additionalDetails")
                                  .exec();
        res.status(200).json({
            success: true,
            message: "User data fetched successfully",
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try{
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;

        const updatedPicture = await uploadFileToCloudinary(displayPicture, process.env.FOLDER_NAME, 1000, 1000);
        console.log("updated Picture..", updatedPicture)

        const user = await User.findByIdAndUpdate(
            {
                _id: userId
            },
            {
                image: updatedPicture.secure_url
            },
            {
                new: true
            }
        )

        

        return res.status(200).json({
            success: true,
            data: user,
            message: "Profile picture updated successfully"
        });
        
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        let userDetails = await User.findById(userId)
                            .populate({
                                path: "courses",
                                populate: {
                                    path:"courseContent",
                                    populate: {
                                        path: "subSection"
                                    }
                                }
                            })
                            .exec()

        userDetails = userDetails.toObject()

        var totalVideos = 0
        for(var i=0; i < userDetails.courses.length; i++) {
            let currCourse = userDetails.courses[i]
            let totalDurationInSeconds = 0
            totalVideos = 0
            for(var j=0; j < currCourse.courseContent.length; j++) {
                totalDurationInSeconds += currCourse.courseContent[j].subSection
                                        .reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                currCourse.totalDuration = convertSecondsToDuration(totalDurationInSeconds)
                totalVideos += currCourse.courseContent[j].subSection.length                  
            }
            let courseProgress = await CourseProgress.findOne({
                userId: userId,
                courseId: currCourse._id
            })
            console.log("COURSE PROGRESS....", courseProgress)
            const completedVideos = courseProgress.completedVideos?.length 
            if(totalVideos === 0) {
                currCourse.progressPercentage = 100
            } else {
                const multiplier = Math.pow(10, 2)
                currCourse.progressPercentage = Math.round((completedVideos / totalVideos) * 100 * multiplier)
                                                / multiplier
            }
        }
        if(!userDetails) {
            return res.status(400).json({
                success: false,
                mesaage: `Could not fetch user with id: ${userId}`
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses
        })
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        })
    }
}

exports.instructorDashboard = async (req, res) => {
    try{
        const userId = req.user.id;
        const instructorCourses = await Course.find({instructor: userId});
       
        const courseData = instructorCourses.map((course) => {
            const totalStudentsEnrolled = course.studentEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled: totalStudentsEnrolled,
                totalAmountGenerated: totalAmountGenerated,
            }
            return courseDataWithStats;
        });
        return res.status(200).json({
            success: true,
            data: courseData,
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}