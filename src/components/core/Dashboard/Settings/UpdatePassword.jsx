import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {AiOutlineEyeInvisible} from "react-icons/ai"
import {AiOutlineEye} from "react-icons/ai"
import IconBtn from '../../../common/IconBtn'
import { changepassword } from '../../../../services/operations/SettingsAPI'


export const UpdatePassword = () => {

    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const {
        register, handleSubmit, setValue, formState: {errors}
    } = useForm()

    const submitPasswordForm = async (data) => {
        try {
            const res = await changepassword(data, token)
            if(res) {
                setValue("oldPassword","")
                setValue("newPassword", "")
            }

        } catch (err) {
            console.log("Error in updating password..", err)
        }
    }

  return (
    <>
        <form onSubmit={handleSubmit(submitPasswordForm)}>
            <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="relative flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor='oldPassword' className="lable-style">
                            Current Password
                        </label>
                        <input 
                            type={showOldPassword ? "text" : "password"}
                            name='oldPassword'
                            id='oldPassword'
                            placeholder='Enter Current Password'
                            className='form-style'
                            {...register("oldPassword", {required: true})}
                        />
                        <span onClick={() => setShowOldPassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"    
                        >
                            {showOldPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                            )}
                        </span>
                        {errors.oldPassword && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please Enter your current Password
                            </span>
                        )}
                    </div>
                    <div className="relative flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor='newPassword' className="lable-style">
                                New Password
                        </label>
                        <input 
                            type={showNewPassword ? "text" : "password"}
                            name='newPassword'
                            id='newPassword'
                            placeholder='Enter New Password'
                            className='form-style'
                            {...register("newPassword", {required: true})}
                            minLength={8}
                            maxLength={12}
                        />
                        <span className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                        >
                            {showNewPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                            )}
                        </span>
                        {errors.newPassword && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please Enter your current Password
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={() => navigate("/dashboard/my-profile")}
                    className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                >
                    Cancel
                </button>
                <IconBtn type="submit" text="Update"/>
            </div>

        </form>
    
    
    </>
  )
}
