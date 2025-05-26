import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { FaShareSquare } from 'react-icons/fa'
import {BsFillCaretRightFill} from 'react-icons/bs'
import toast from 'react-hot-toast'
import { addToCart } from '../../../slice/cartSlice'
import copy from 'copy-to-clipboard'

export const CourseDetailsCard = ({course, handleBuyCourse, handleAddToCart, loading}) => {
  
    const {user} = useSelector((state) => state.profile)

    const handleShare = () => {
        copy(window.location.href)
        toast.success("Link copied to clipboard")
    }

    return (
        <>
            <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
                <img className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
                    src={course?.thumbnail}
                    alt={course?.courseName}
                />
                <div className="px-4">
                    <div className="space-x-3 pb-4 text-3xl font-semibold">
                        Rs. {course?.price}
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            disabled={loading} 
                            className="yellowButton"
                            onClick={handleBuyCourse}> 
                            {user && course?.studentEnrolled.includes(user._id) ? 
                                ("Go To Course") : ("Buy Course")    
                            }
                        </button >
                        {(!user || !course?.studentEnrolled.includes(user._id)) && (
                            <button
                                className="blackButton"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>    
                        )}
                    </div>
                    <div>
                        <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
                            30-Day Money-Back Guarentee
                        </p>
                    </div>

                    <div>
                        <p className={`my-2 text-xl font-semibold `}>
                            Requirements:
                        </p>
                        <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
                            {course?.instructions?.map((item, i) => {
                                return (
                                <p className={`flex gap-2`} key={i}>
                                    <BsFillCaretRightFill />
                                    <span>{item}</span>
                                </p>
                                )
                            })}
                        </div>
                        <div className="text-center">
                            <button
                                className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
                                onClick={handleShare}
                            >
                                <FaShareSquare size={15}/> Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}
