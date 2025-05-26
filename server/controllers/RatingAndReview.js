const RatingAndReview = require("../models/ratingAndReview");
const User = require("../models/user");
const Course = require("../models/course");
const { default: mongoose } = require("mongoose");


exports.createRating = async (req, res) => {
    try{
        const userId = req.user.id;
        const {rating, review, courseId} = req.body;

        // user enrolled or not
        const userEnrolled = await Course.findOne(
            {
                _id: courseId,
                studentEnrolled: {
                    $elemMatch: {
                        $eq: userId
                    }
                },
            },
            
        );
        console.log(userEnrolled);

        if(!userEnrolled) {
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course',
            });
        }

        const alreadyReviewed = await RatingAndReview.findOne({
                                        user: userId,
                                        course: courseId,
                                    });

        if(alreadyReviewed) {
            return res.status(403).json({
                success:false,
                message:'Course is already reviewed by the you',
            });
        }

        const ratingReview = await RatingAndReview.create({
                                    rating, review,
                                    user: userId,
                                    course: courseId,
                            }); 

        const updatedCourse = await Course.findByIdAndUpdate(
                                    {
                                        _id: courseId,
                                    },
                                    {
                                        $push: {
                                            ratingAndReviews: ratingReview._id,
                                        },
                                    },
                                    {
                                        new: true,
                                    },
                                );

        console.log(updatedCourse);

        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
            course: updatedCourse,
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.getAverageRating = async (req, res) => {
    try{
        const courseId = req.body.courseId;

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"}
                }
            }
        ]);

        if(result.length > 0) {
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })

        }
        
        //if no rating/Review exist
        return res.status(200).json({
            success:true,
            message:'Average Rating is 0, no ratings given till now',
            averageRating:0,
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.getAllRating = async (req, res) => {
    try{
        const allRatingAndReviews = await RatingAndReview.find({})
                                    .sort({
                                        rating: "desc"
                                    })
                                    .populate({
                                        path: "user",
                                        select: "firstName lastName email image",
                                    })
                                    .populate({
                                        path: "course",
                                        select: "courseName ",
                                    })
                                    .exec();
        console.log("Ratings fetched success...", allRatingAndReviews)
        return res.status(200).json({
            success: true,
            message: "All rating and reviews fetched successfully",
            data: allRatingAndReviews,
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: true,
            message: error.message,
        });
    }
}