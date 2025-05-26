import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../common/IconBtn'
import { Navigate, useNavigate } from 'react-router-dom'
import {VscAdd} from "react-icons/vsc"
import { CourseTable } from './InstructorCourses/CourseTable'
import { deleteAllCourses, fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import {FiTrash2} from "react-icons/fi"
import { RiDeleteBin6Line } from 'react-icons/ri'


export const MyCourses = () => {

  const navigate = useNavigate()
  const {token} = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  


  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    }
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteAll = async (courses) => {
    setLoading(true)
    const result = await deleteAllCourses({courses}, token)
    if(result) {
      setCourses([])
    } 
    setLoading(false)
  } 


  return (
    <div className='relative'>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>

         {courses.length && (
             <button 
                onClick={() => handleDeleteAll(courses)}
                className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
              >
              <RiDeleteBin6Line />
              <span>
                  Delete all
              </span>
            </button>
         )}
          
      
      </div>
      
      {courses && <CourseTable courses={courses} setCourses={setCourses} />}

      <IconBtn
        text="Add Course"
        onclick={() => navigate("/dashboard/add-course")}
        customClasses={"mt-10 absolute right-0"}
      >
        <VscAdd />
      </IconBtn>
    </div>
  )
}
