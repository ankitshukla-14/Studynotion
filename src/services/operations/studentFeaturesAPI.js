import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { studentEndPoints } from "../apis";
import { setPaymentLoading } from "../../slice/courseSlice";
import { resetCart } from "../../slice/cartSlice";
import rzpLogo from "../../assets/Logo/rzp_logo.png"


const razorpay_key = process.env.REACT_APP_RAZORPAY_KEY
const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndPoints

function loadScript(src) {
    return new Promise((resolve) => {
        console.log("loadscript called...")
        const script = document.createElement("script")
        script.src = src

        script.onload = () => {
            resolve(true)
            console.log("RESOLVED")
        }
        script.onerror = () => {
            resolve(false)
            console.log("NOT RESOLVED")
        }
        document.body.appendChild(script)
    })
}


export async function buyCourse(courses, token, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...")
    try {
        console.log("Script loading....")
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        console.log("Script loaded...")
        if(!res) {
            toast.error("RazorPay SDK failed to load")
            toast.dismiss(toastId)
            return
        }

        // initiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {courses}, {
            Authorization: `Bearer ${token}`
        })

        if(!orderResponse?.data?.success) {
            throw new Error(orderResponse?.data?.message)
        }

        console.log("PRINTING ORDERESPONSE...", orderResponse)

        const options = {
            key: razorpay_key,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amout}`,
            order_id: orderResponse.data.data.id,
            name: "StudyNotion",
            description: "Thank You for Purchasing the Course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            handler: function(response) {
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
                verifyPayment({...response, courses}, token, navigate, dispatch)
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open()
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed")
            console.log(response.error)
        })

    } catch(error) {
        console.log("PAYMENT API ERROR....", error)
        toast.error("Could not make payment")
    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
        console.log("PAyment successfull email send")
    }
    
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

async function verifyPayment(body, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....")
    dispatch(setPaymentLoading(true))
    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, body, {
            Authorization: `Bearer ${token}`
        })
        if(!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success("Payment Successful, You are added to the course")
        navigate("/dashboard/enrolled-courses")
        dispatch(resetCart())
    } catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}