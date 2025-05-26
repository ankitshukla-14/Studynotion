import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API } = profileEndpoints

export const getUserEnrolledCourses = async (token) => {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const res = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, null , {
            Authorization: `Bearer ${token}`
        })
        console.log("GET_USER_ENROLLED_COURSES_API respnse...", res)
        if(!res?.data?.success) {
            throw new Error("Could not get enrolled courses")
        }
        result = res?.data?.data
    } catch (error) {
        console.log("GET_USER_ENROLLED_COURSES_API  ERROR............", error)
        toast.error("Could Not Get Enrolled Courses")
    }
    toast.dismiss(toastId)
    return result
}

export const getInstructorData = async (token) => {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
            Authorization: `Bearer ${token}`
        })
        if(!response?.data?.success) {
            throw new Error("Could not fetch Instructor Data")
        }
        console.log("GET_INSTRUCTOR_API_RESPONSE", response);
        result = response?.data?.data
    } catch(error) {
        console.log("GET_INSTRUCTOR_API ERROR", error);
        toast.error("Could not Get Instructor Data")
    }
    toast.dismiss(toastId);
    return result;
}