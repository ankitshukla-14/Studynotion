import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { settingsEndpoints } from "../apis"

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints


export const updateDisplayPicture = async (formData, token) => {
    const toastId = toast.loading("Loading...")
    let res = null
    try {
        const response = await apiConnector(
            "PUT",
            UPDATE_DISPLAY_PICTURE_API,
            formData, 
            {
                Authorization: `Bearer ${token}`
            }
        )
        console.log("UPDATE DISPLAY PICTURE API Response...", response)
        if(!response?.data?.success) {
            throw new Error(response?.data?.message)
        }
        toast.success("Display Picture Updated")
        res = response?.data?.data
    } catch (error) {
        console.log("UPDATE_DISPLAY_PICTURE_API Error...", error)
        toast.error("Could not Update Display Picture")
    }
    toast.dismiss(toastId)
    return res
}

export const updateProfile = async (formData, token) => {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiConnector(
            "PUT",
            UPDATE_PROFILE_API,
            formData,
            {
                Authorization: `Bearer ${token}`
            }
        )
        console.log("UPDATE_PROFILE_API Response...", response)
        if(!response?.data?.success) {
            throw new Error(response?.data?.message)
        }
        result = response.data.data
        toast.success("Profile Updated Successfully")
    } catch(error) {
        console.log("UPDATE_PROFILE_API Error...", error)
        toast.error("Could not update profile")
    }
    toast.dismiss(toastId)
    return result
}

export const changepassword = async (formData, token) => {
    const toastId = toast.loading("Loading...")
    let success = false
    try {
        const response = await apiConnector(
            "POST",
            CHANGE_PASSWORD_API,
            formData,
            {
                Authorization: `Bearer ${token}`
            }
        )
        console.log("CHANGE_PASSWORD_API Response...", response)
        if(!response?.data?.success) {
            throw new Error(response?.data?.message)
        }
        toast.success("Password Changed Successfully")
        success = response.data.success
    } catch(error) {
        console.log("CHANGE_PASSWORD_API Error...", error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
    return success
}

export const deleteProfile = async (token) => {
    const toastId = toast.loading("Loading...")
    let result = null
    try {
        const response = await apiConnector(
            "DELETE",
            DELETE_PROFILE_API,
            null,
            {
                Authorization: `Bearer ${token}`
            }
        )
        console.log("DELETE_PROFILE_API Response...", response)
        if(!response?.data?.success) {
            throw new Error(response?.data?.message)
        }
        toast.success("Account Deleted Successfully")
        result = true
    } catch(error) {
        console.log("DELETE_PROFILE_API Error...", error)
        toast.error("Could not delete account")
    }
    toast.dismiss(toastId)
    return result
}