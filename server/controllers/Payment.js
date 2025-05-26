const mongoose = require("mongoose")
const crypto = require("crypto")
const Course = require("../models/course")
const { instance } = require("../config/razorpay")
const { error } = require("console")
const CourseProgress = require("../models/courseProgress")
const User = require("../models/user")
const mailSender = require("../utils/mailSender")
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")

exports.capturePayment = async (req, res) => {
    const {courses} = req.body
    const userId = req.user.id

    if(courses.length === 0) {
        return res.json({
            success: false,
            message: "Please Provide Course Id"
        })
    }

    let total_amount = 0
    console.log("Capture payment called/..")
    for(const course_id of courses) {
        let course
        try {
            
            course = await Course.findById(course_id)
            if(!course) {
                return res.status(404).json({
                    success: false,
                    message: "Could not find the course"
                })
            }
            const uid = new mongoose.Types.ObjectId(userId)
            if(course.studentEnrolled.includes(uid)) {
                return res.status(500).json({
                    success: false,
                    message: "Student is already Enrolled"
                })
            }
            total_amount += course.price
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    try {
        // INITIATE THE PAYMENT USING RAZORPAY
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        return res.status(200).json({
            success: true,
            data: paymentResponse
        })
    } catch(error) {
        console.log("Payment response error..", error)
        res.status(500).json({
            success: false,
            message: "Could not initiate order"
        })
    }

}

exports.verifyPayment = async (req, res) => {
    console.log("VerifyPayment called...")
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        courses
    } = req.body
    const userId = req.user.id

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(404).json({
            success: false,
            message: "Payment Failed"
        })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
                        .createHmac("sha256", process.env.RAZORPAY_SECRET)
                        .update(body.toString())
                        .digest("hex")

    if(expectedSignature === razorpay_signature) {
        await enrollStudent(courses, userId, res)
        return res.status(200).json({
            success: true, 
            message: "Payment Verified"
        })
    }
    return res.status(500).json({
        success: false,
        message: "Payment Failed"
    })
}

const enrollStudent = async (courses, userId) => {
    if(!courses || !userId) {
        return res.status(400).json({
            success: false, 
            message: "Please provide Course Id and User id"
        })
    }

    for(const courseId of courses) {
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                {
                    _id: courseId
                },
                {$push: {
                    studentEnrolled: userId, 
                }},
                {
                    new: true
                }
            )
            if(!enrolledCourse) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                })
            }
            const courseProgress = await CourseProgress.create({
                courseId: courseId,
                userId: userId,
                completedVideos: [],
            })

            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {$push: {
                    courses: courseId,
                    courseProgress: courseProgress._id
                }},
                {
                    new: true
                }
            )

            console.log("Enrolled Student: ", enrollStudent)

            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolledn in ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName,
                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )
            console.log("Email sent successfully: ", emailResponse.response)
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                error: error.message
            })
        }
    }
}

exports.sendPaymentSuccessEmail = async (req, res) => {
    const {orderId, paymentId, amount} = req.body
    const userId = req.user.id

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(404).json({
            success: false,
            message: "Please provide all the details"
        })
    }

    try {
        const enrolledStudent = await User.findById(userId)

        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        )

        console.log("Payment success mail send success")
    } catch(error) {
        console.log("Error in sending mail ", error)
        return res.status(400).json({
            success: false,
            message: "Could not send mail"
        })
    }
}