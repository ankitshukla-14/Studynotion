import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaFileUpload } from 'react-icons/fa'
import { Player } from 'video-react'

export const Upload = ({
    name, label, register, setValue,  errors, 
    video, viewData = null, editData = null
}) => {
    // const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewSource, setPreviewSource] = useState(
        viewData ? viewData : editData ? editData : ""
    )


    useEffect(() => {
        register(name, {required: true})
    },[register]) 

    useEffect(() => {
        setValue(name, selectedFile)
      }, [selectedFile, setValue])

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0]
        if(file) {
            previewFile(file)
            setSelectedFile(file)
        }
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: !video
        ? {"image/*": [".jpeg", ".jpg", ".png"]}
        : {"video/*": [".mp4"]},
        onDrop
    })

  return (
    <div className="flex flex-col space-y-2">
        <label htmlFor={name} className="text-sm text-richblack-5">
            {label}
        </label>
        <div className={`${
            isDragActive ? "bg-richblack-600" : "bg-richblack-700"
            } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}>
            {previewSource ? (
                <div className="flex w-full flex-col p-6">
                    {!video ? (
                        <img 
                            src={previewSource}
                            alt='Preview'
                            className="h-full w-full rounded-md object-cover"
                        />
                    ) : (
                        <Player src={previewSource} aspectRatio='16:9' playsInline/>
                    )}
                    {!viewData && (
                        <button
                            type='button'
                            onClick={() => {
                                setPreviewSource(null)
                                setSelectedFile(null)
                                setValue(null)
                            }}
                             className="mt-3 text-richblack-400 underline"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            ) : (
                <div {...getRootProps()}
                    className="flex w-full flex-col items-center p-6"
                >
                    <input {...getInputProps()}/>
                    <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                        <FaFileUpload  className="text-2xl text-yellow-50" />
                    </div>
                    <p  className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                        Drag and drop an {!video ? "image" : "video"}, or click to
                        <span className="font-semibold text-yellow-50"> Browse</span> a 
                        file
                    </p>
                    <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
                        <li>Aspect rarion 16:9</li>
                        <li>Recommended size 1024x576</li>
                    </ul>
                </div>
            )}
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}
        </div>        
    </div>
  )
}
