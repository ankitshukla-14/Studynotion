import React, { useState } from 'react'
import { MdEdit, MdOutlineDoNotDisturbOnTotalSilence } from 'react-icons/md'
import {RxDropdownMenu} from "react-icons/rx"
import {RiDeleteBin6Line} from "react-icons/ri"
import { useDispatch, useSelector } from 'react-redux'
import {AiFillCaretDown} from "react-icons/ai"
import {FaPlus} from "react-icons/fa"
import { setCourse } from '../../../../../slice/courseSlice'
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI'
import { SubSectionModal } from './SubSectionModal'
import ConfirmationModal from '../../../../common/ConfirmationModal'


export const NestedView = ({handleChangeEditSectionName}) => {

    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const [addSubSection, setAddSubSection] = useState(null)
    const [viewSubSection, setViewSubSection] = useState(null)
    const [editSubSection, setEditSubSection] = useState(null)

    const [confirmationModalData, setConfirmationModalData] = useState(null);
    const dispatch = useDispatch()

    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection({sectionId, courseId: course._id},
            token
        )
        if(result) {
           dispatch(setCourse(result))
        }
        setConfirmationModalData(null)
    }

    const handleDeleteSubSection = async(subSectionId, sectionId) => {
        const result = await deleteSubSection({sectionId, subSectionId}, token)
        if(result) {
            const updatedCourseContent = course.courseContent.map((section) => (
                section._id === sectionId ? result : section 
            ))
            const updatedCourse = {...course, courseContent: updatedCourseContent}
            dispatch(setCourse(updatedCourse))
        }
        setConfirmationModalData(null)
    }


  return (
    <>
        <div className="rounded-lg bg-richblack-700 p-6 px-8">
            {course?.courseContent?.map((section) => (
                <details key={section._id} open>

                    <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">

                        {/* name and menu */}
                        <div className="flex items-center gap-x-3">
                            <RxDropdownMenu  className="text-2xl text-richblack-50"  />
                            <p className="font-semibold text-richblack-50">
                                {section.sectionName}
                            </p>
                        </div>

                        {/* icons  */}
                        <div className="flex items-center gap-x-3">
                            {/* EDIT ICON */}
                            <button 
                                onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                            >
                                <MdEdit className="text-xl text-richblack-300" />

                            </button>

                            {/* DELETE ICON */}
                            <button
                                onClick={() => setConfirmationModalData({
                                    text1: "Delete this Section?",
                                    text2: "All the lectures in this section will be deleted",
                                    btn1Text: "Delete",
                                    btn2Text: "Cancel",
                                    btn1Handler: () => handleDeleteSection(section._id),
                                    btn2Handler: () => setConfirmationModalData(null)

                                })}
                            >
                                <RiDeleteBin6Line className="text-xl text-richblack-300"/>
                            </button>

                            <span className="font-medium text-richblack-300">|</span>
                            <AiFillCaretDown className={`text-xl text-richblack-300`} />
                        
                        </div>

                    </summary>

                    <div className="px-6 pb-4">
                        {/* SUB-SECTIONS */}
                        {section.subSection.map((data) => (
                            <div key={data?._id}
                                onClick={() => setViewSubSection(data)}
                                className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                            >
                                {/* SUB-SECTION NAME AND DROP DOWN */}
                                <div className="flex items-center gap-x-3 py-2 ">
                                    <RxDropdownMenu />
                                    <p className="font-semibold text-richblack-50">
                                        {data.title}
                                    </p>
                                </div>
                                <div className="flex items-center gap-x-3"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* EDIT BUTTON */}
                                    <button
                                        onClick={() => setEditSubSection({...data, sectionId: section._id})}
                                    >
                                        <MdEdit className="text-xl text-richblack-300" />
                                    </button>

                                    {/* DELETE BUTTON */}
                                    <button onClick={() => setConfirmationModalData({
                                        text1: "Delete this Sub-Section?",
                                        text2: "This lecture will be deleted",
                                        btn1Text: "Delete",
                                        btn2Text: "Cancel",
                                        btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                        btn2Handler: () => setConfirmationModalData(null),
                                    })}>
                                        <RiDeleteBin6Line className="text-xl text-richblack-300" />
                                    </button>
                                </div>
                            </div>                      
                        ))}

                        {/* ADD LECTURE BUTTON */}
                        <button className="mt-3 flex items-center gap-x-1 text-yellow-50"
                            onClick={() => setAddSubSection(section._id)}
                        >
                            <FaPlus className="text-lg" />
                            <p>Add Lecture</p>
                        </button>
                    </div>             
                </details>
            ))}
        </div>
        {addSubSection ? (
            <SubSectionModal
                modalData={addSubSection}
                setModalData={setAddSubSection}
                add={true}
            />
        ) : viewSubSection ? (
            <SubSectionModal
                modalData={viewSubSection}
                setModalData={setViewSubSection}
                view={true}
            />
        ) : editSubSection ? (
            <SubSectionModal
                modalData={editSubSection}
                setModalData={setEditSubSection}
                edit={true}
            />
        ) : (
            <></>
        )}
        {/* Confirmation Modal */}
        {confirmationModalData ? (
            <ConfirmationModal modalData={confirmationModalData} />
        ) : (
            <></>
        )}
    </>

  )
}
