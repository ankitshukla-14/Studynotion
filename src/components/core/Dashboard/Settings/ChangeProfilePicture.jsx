import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'
import {FiUpload} from "react-icons/fi"
import { updateDisplayPicture } from '../../../../services/operations/SettingsAPI'
import { setUser } from '../../../../slice/profileSlice'
import toast from 'react-hot-toast'

export const ChangeProfilePicture = () => {

    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [previewSource, setPreviewSource] = useState(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if(imageFile) {
            
        }
    }, [imageFile])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if(file) {
            setImageFile(file)
            // console.log("Imange file..", imageFile)
            previewFile(file)
        }
    }

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }

    const handleFileUpload = async () => {
        if(!imageFile) {
            toast.error("Select an Image")
            return;
        }
        console.log("Uploading...")
        setLoading(true)
        const formData = new FormData()
        formData.append("displayPicture", imageFile)
        const res = await updateDisplayPicture(formData, token, dispatch)
        if(res) {
            dispatch(setUser(res))
        }
        setLoading(false)
    }


  return (
    <>
        <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
            <div className="md:flex items-center sm gap-x-4 ">
                <img 
                    src={previewSource || user?.image}
                    alt={`profile-${user?.firstName}`}
                    className='object-cover aspect-square w-[78px] rounded-full'
                />
                <div className="space-y-2 ">
                    <p>Change Profile Picture</p>
                    <div className="flex flex-row gap-3">
                        <input 
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            className='hidden'
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() =>  fileInputRef.current.click()}
                            disabled={loading}
                            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                        >
                            {imageFile ? 
                                <div className='flex gap-x-2 relative'>
                                    {imageFile.name}
                                    <span className='text-pink-100 hover:text-pink-200 transition duration-200 translate-x-2 ' 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setImageFile(null)
                                        setPreviewSource(null)
                                    }}>
                                        x
                                    </span>
                                </div> 
                                
                            : "Select"}
                        </button>
                        <IconBtn
                            text={loading ? "Uploading" : "Upload"}
                            onclick={handleFileUpload}
                        >
                            {!loading && (
                                <FiUpload className="text-lg text-richblue-900" /> 
                            )}
                        </IconBtn>                       
                    </div>
                </div>
            </div>
        </div>

    </>
  )
}
