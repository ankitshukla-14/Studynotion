import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'
import { setCompletedLectures, setCourseEntireData, setCourseSectionData, setTotalNoOfLectures } from '../slice/viewCourseSlice'
import { Outlet, useParams } from 'react-router-dom'
import { CourseReviewModal } from '../components/core/ViewCourse/CourseReviewModal'
import { VideoDetailsSidebar } from '../components/core/ViewCourse/VideoDetailsSidebar'

export const ViewCourse = () => {

    const {courseId} = useParams()
    const {token} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [reviewModal, setReviewModal] = useState(false)
    
    useEffect(() => {
        const fetchCourse = async () => {
            const course = await getFullDetailsOfCourse(courseId, token)
            console.log("COURSE FETCHED...", course)
            dispatch(setCourseEntireData(course))
            dispatch(setCourseSectionData(course.courseContent))
            dispatch(setCompletedLectures(course.completedLectures))
            dispatch(setTotalNoOfLectures(course.totalLectures))
        }
        fetchCourse()
    }, [])

  return (
    <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar setReviewModal={setReviewModal}/>
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-6">
                    <Outlet />
                </div>
            </div>
        </div>
        {reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>}
    </>
  )
}
