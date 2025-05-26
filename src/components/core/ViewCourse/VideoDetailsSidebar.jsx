import React, { useEffect, useState } from 'react'
import { set } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {IoIosArrowBack} from "react-icons/io"
import IconBtn from '../../common/IconBtn'
import {BsChevronDown} from "react-icons/bs"
import toast from 'react-hot-toast'
 
export const VideoDetailsSidebar = ({setReviewModal}) => {

    const navigate = useNavigate()
    const location = useLocation()
    const [activeSection, setActiveSection] = useState("")
    const [activeSubSection, setActiveSubSection] = useState("")
    const {sectionId, subSectionId} = useParams()
    const {courseEntireData, courseSectionData, completedLectures, totalNoOfLectures, reviewed} = useSelector((state) => state.viewCourse)

    useEffect(() => {
        const currSectionIdx = courseSectionData.findIndex(
            (section) => section._id === sectionId
        )
        const currSubSectionIdx = courseSectionData?.[currSectionIdx]?.subSection.findIndex(
            (subSection) => subSection._id === subSectionId
        )
        const activeSectionId = courseSectionData?.[currSectionIdx]?._id
        const activeSubSectionId = courseSectionData?.[currSectionIdx]?.subSection?.[currSubSectionIdx]?._id
        setActiveSection(activeSectionId)
        setActiveSubSection(activeSubSectionId)
    }, [courseEntireData, location.pathname, courseSectionData])

    const handleReview = () => { 
        setReviewModal(true)
    }

  return (
    <>
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">

            <div className="mx-5 flex items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
               
                <div
                    onClick={() => navigate("/dashboard/enrolled-courses")}
                     className="flex h-[35px] w-[35px] items-center justify-center mt-1 rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90 transition duration-200 cursor-pointer"
                    title="back"   
                >
                    <IoIosArrowBack size={15} />
                </div>

                <IconBtn 
                    text="Add Review"
                    customClasses="ml-auto"
                    onclick={handleReview}                
                />
            </div>

            <div className="flex flex-col ">
                <p className="ml-2 mt-2 text-xl font-bold opacity-80 text-richblack-5">{courseEntireData?.courseName}</p>
                <p className="ml-2 mt-2 text-sm font-semibold text-richblack-500">
                    {completedLectures.length} / {totalNoOfLectures}
                </p>
            </div>

            <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                {courseSectionData.map((section, index) => (
                    <div className="mt-2 cursor-pointer text-sm text-richblack-5"
                        onClick={() => setActiveSection(section._id)}
                        key={index}
                    >
                        {/* SECTION */}
                        <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                            <div className="w-[70%] font-semibold">
                                {section.sectionName}
                            </div>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`${activeSection === section._id 
                                        ? "rotate-0" : "rotate-180"
                                    } transition-all duration-500`}
                                >
                                    <BsChevronDown />
                                </span>
                            </div>
                        </div>

                        {/* SUB-SECTION */}
                        {activeSection === section._id && (
                            <div className="transition-[height] duration-500 ease-in-out">
                                {section.subSection.map((subSection, i) => (
                                    <div
                                        className={`${activeSubSection === subSection._id 
                                            ? "bg-yellow-200 font-semibold text-richblack-800" 
                                            : "hover:bg-richblack-900"
                                            } flex gap-3  px-5 py-2`}
                                        key={i}
                                        onClick={() => {
                                            setActiveSubSection(subSection._id)
                                            navigate(`/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${subSection._id}`)
                                        }}
                                    >   
                                        <input 
                                            type="checkbox"
                                            checked={completedLectures?.includes(subSection?._id)}
                                            onChange={() => {}}
                                        />
                                        {subSection.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
       </div>
    
    </>
  )
}
