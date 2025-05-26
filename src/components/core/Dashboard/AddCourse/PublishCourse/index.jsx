import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn'
import { useDispatch, useSelector } from 'react-redux'
import { resetCourseState, setStep } from '../../../../../slice/courseSlice'
import { useNavigate } from 'react-router-dom'
import {COURSE_STATUS} from "..//..//..//..//..//utils/constants"
import {  updateCourse } from '../../../../../services/operations/courseDetailsAPI'

export const PublishCourse = () => {

    const {register, handleSubmit, getValues, setValue} = useForm()
    const dispatch = useDispatch()
    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||
        (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)) {
            dispatch(resetCourseState())
            navigate("/dashboard/my-courses")
            return
        }
        const formData = new FormData()
        formData.append("courseId", course._id)
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
        formData.append("status", courseStatus)
        setLoading(true)
        const result = await updateCourse(formData, token)
        if(result) {
            dispatch(resetCourseState())
            navigate("/dashboard/my-courses")
        }
        setLoading(false)
    }

    useEffect(() => {
        if(course?.status === COURSE_STATUS.PUBLISHED) {
            setValue("public", true)
        }
    }, [])

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">
            Publish Settings
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-6 mb-8">
                <label htmlFor='public' className="inline-flex items-center text-lg">
                    <input 
                        type='checkbox'
                        id='public'
                        {...register("public")}
                        className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                    />
                    <span className="ml-2 text-richblack-400">
                        Make this course as public
                    </span>
                </label>
            </div>
            {/* NEXT PREV BUTTON */}
            <div className="ml-auto flex max-w-max items-center gap-x-4">
                <button 
                    disabled={loading}
                    type='button'
                    onClick={() => dispatch(setStep(2))}
                    className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                >
                    Back
                </button>
                <IconBtn text="Save Changes" disabled={loading} />
            </div>
        </form>

    </div> 
  )
}
