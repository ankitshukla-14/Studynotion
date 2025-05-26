const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    courseEntireData: [],
    courseSectionData: [],
    completedLectures: [],
    totalNoOfLectures: 0,
}

const viewCourseSlice = createSlice({
    name: "viewCourse",
    initialState,
    reducers: {
        setCourseEntireData: (state, action) => {
            state.courseEntireData = action.payload
        },
        setCourseSectionData: (state, action) => {
            state.courseSectionData = action.payload
        },
        setCompletedLectures: (state, action) => {
            state.completedLectures = action.payload
        },
        setTotalNoOfLectures: (state, action) => {
            state.totalNoOfLectures = action.payload
        }, 
        updateCompletedLectures: (state, action) => {
            state.completedLectures = [...state.completedLectures, action.payload]
        },
    }
})

export const {
    setCourseEntireData,
    setCourseSectionData,
    setCompletedLectures,
    setTotalNoOfLectures,
    updateCompletedLectures,
} = viewCourseSlice.actions

export default viewCourseSlice.reducer