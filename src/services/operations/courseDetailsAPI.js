import toast from "react-hot-toast";
import {apiConnector} from "../apiConnector"
import { courseEndPoints, ratingEndPoints } from "../apis";

const {
    GET_ALL_COURSES_API,
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    CREATE_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_COURSE_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_COURSE_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    LECTURE_COMPLETION_API,
    CREATE_RATING_API,
    DELETE_ALL_COURSES_API    
} = courseEndPoints;

const {REVIEW_DETAILS_API} = ratingEndPoints

export const fetchInstructorCourses = async (token) => {
    let result = []
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("GET", GET_ALL_COURSES_API, null, {
            Authorization: `Bearer ${token}`
        })
        console.log("INSTRUCTOR COURSES API RESPONSE............", response)
        if(!response?.data?.success) {
            throw new Error("Could not get the courses")
        }
        result = response?.data?.data
    } catch(error) {
        console.log("GET ALL COURSES API ERROR", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result

}

export const getFullCourseDetails = async (courseId) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", COURSE_DETAILS_API, {
            courseId
        })
        
        console.log("COURSE DETAILS API RESPONSE............", response)
        if(!response?.data?.success) {
            throw new Error("Could not get the course")
        }
        result = response?.data?.data
    } catch(error) {
        console.log("COURSE_DETAILS_API API ERROR............", error)
        result = error.response.data
    }
    toast.dismiss(toastId)
    return result
}

export const fetchCourseCategories = async () => {
    let result = []
    try {
      const response = await apiConnector("GET", COURSE_CATEGORIES_API)
      console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Fetch Course Categories")
      }
      result = response?.data?.data
    } catch (error) {
      console.log("COURSE_CATEGORY_API API ERROR............", error)
      toast.error(error.message)
    }
    return result
  }

export const createCourse = async (body,  token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_COURSE_API, body, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        })
        console.log(response)
        if(!response?.data?.success) {
            throw new Error("Could not create course")
        }
        result = response?.data?.data
        toast.success("Course Created")
    } catch(error) {
        console.log("CREATE COURSE API ERROR", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const createSection = async (body, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_SECTION_API, body, {
            Authorization: `Bearer ${token}`
        })
        if(!response?.data?.success) {
            throw new Error("Could not create section")
        }
        result = response?.data?.data
        toast.success("Section Created")
    } catch(error) {
        console.log("CREATE SECTION API ERROR", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const createSubSection = async (body, token) => {
    let result = null;
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_SUBSECTION_API, body, {
            Authorization: `Bearer ${token}`
        })
        console.log("CREATE SUB-SECTION API RESPONSE...", response)
        if(!response.data.success) {
            throw new Error("Could not add Lecture")
        }
        toast.success("Lecture Added")
        result = response?.data?.data

    } catch(error) {
        console.log("CREATE SUB-SECTION API ERROR...", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const updateCourse = async (body, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", UPDATE_COURSE_API, body, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        })
        if(!response?.data?.success) {
            throw new Error("Could not update course details")
        }
        result = response?.data?.data
        toast.success("Course Details Updated Successfully")
    } catch(error) {
        console.log("EDIT COURSE API ERROR", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const updateSection = async (body, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", UPDATE_SECTION_API, body, {
            Authorization: `Bearer ${token}`
        })

        if(!response?.data?.success) {
            throw new Error("Could not update section")
        }
        result = response?.data?.data
        toast.success("Section Updated")
    } catch(error) {
        console.log("UPDATE SECTION API ERROR", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const updateSubSection = async (body, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", UPDATE_SUBSECTION_API, body, {
            Authorization: `Bearer ${token}`
        })
        if(!response?.data?.success) {
            throw new Error("Could not update Lecture")
        }
        toast.success("Lecture Updated")
        result = response?.data?.data
    } catch(error) {
        console.log("UPDATE SUB-SECTINO API ERROR...", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteCourse = async (body, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("DELETE", DELETE_COURSE_API, body, {
            Authorization: `Bearer ${token}`
        })
        if(!response?.data?.success) {
            throw new Error("Could not delete course")
        }
        result = response?.data?.data
        toast.success("Course Deleted")
    } catch(error) {
        console.log("DELETE COURSE API ERROR", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
}

export const deleteSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("DELETE", DELETE_SECTION_API, data, {
            Authorization: `Bearer ${token}`
        })
        if(!response?.data?.success) {
            throw new Error("Could not delete Section")
        }
        toast.success("Course Section Deleted")
        // updated course in result
        result = response?.data?.data;        
    } catch(error) {
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result;
}

export const deleteSubSection = async (body, token) => {    
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("DELETE", DELETE_SUBSECTION_API, body, {
            Authorization: `Bearer ${token}`
        })
        console.log("DELETE SUB-SECTION API RESPONSE ", response)
        if(!response?.data?.success) {
            throw new Error("Could not Delete Lecture")
        }
        toast.success("Lecture Deleted")
        result = response?.data?.data
    } catch(error) {
        console.log("DELETE SUB-SECTION API ERROR", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const getFullDetailsOfCourse = async (courseId, token) => {
    const toastId = toast.loading("Loading...")
    let result = null
    try {
        const response = await apiConnector("POST", GET_FULL_COURSE_DETAILS_AUTHENTICATED, 
            {courseId},
            {
                Authorization: `Bearer ${token}`
            })

        console.log("COURSE_FULL_DETAILS_API RESPONSE...", response)
            
        if(!response?.data?.success) {
            throw new Error(response?.data?.message)
        }
        result = response?.data?.data
    } catch(error) {
        console.log("COURSE_FULL_DETAILS_API Error...", error)
    }
    toast.dismiss(toastId)
    return result
}

export const markLectureAsCompleted = async (body, token) => {
    const toastId = toast.loading("Loading...")
    let result = false
    try {
        const response = await apiConnector("POST", LECTURE_COMPLETION_API, body, {
            Authorization: `Bearer ${token}`
        })
        console.log("MARK LECTURE COMPLETED API Response...", response)
        if(!response.data.message) {
            throw new Error("Update course progress api error")
        }
        result = true
        toast.success("Course Progress Updated")
    } catch(error) {
        console.log("MARK LECTURE COMPLETE API Error...", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const createRating = async (body, token) => {
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_RATING_API, body, {
            Authorization: `Bearer ${token}`
        })
        console.log("CREATE RATING API RESPONSE...", response)
        if(!response?.data?.success) {
            throw new Error("Could not create Rating")
        }
        toast.success("Rating Created")
    } catch(error) {
        console.log("CREATE RATING API ERROR...", error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}

export const getAllRatingAndReviews = async () => {
    let result = null
    try {

        const response = await apiConnector(
            "GET",
            REVIEW_DETAILS_API,
        )
        if(!response?.data?.success) {
            throw new Error("Cannot fetch Reviews")
        }
        console.log("GET_REVIEWS_API Response...", response)
        result = response.data.data
    } catch (error) {
        console.log("GET_REVIEW_DETAILS_API Error....", error)
    }
    return result
}

export const deleteAllCourses = async (body, token) => {
    const toastId = toast.loading("Loading...")
    let result = null
    try {
        const response = await apiConnector("DELETE", DELETE_ALL_COURSES_API, body, {
            Authorization: `Bearer ${token}`
        })
        if(!response.data.success) {
            throw new Error("Could not delete all Courses")
        }
        result = response.data.success
        toast.success("All Courses Deleted")
    } catch(error) {
        console.log(error);
        toast.error("Could not delete Courses")
    } 
    toast.dismiss(toastId)
    return result
}