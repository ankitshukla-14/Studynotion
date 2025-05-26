import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { catalogData, categories } from "../apis"


export const getCatalogPageData = async (categoryId) => {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        console.log("abc", categoryId)

        const res = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {categoryId: categoryId})

        if(!res?.data?.success) {
            throw new Error("Could not fetch Category page data")
        }
        result = res?.data?.data
    } catch(error) {
        console.log("ID..", categoryId) 
        console.log("CATALOG PAGE DATA API ERROR....", error)
        toast.error(error.message)
        result = error?.response?.data
    }
    toast.dismiss(toastId)
    return result
}