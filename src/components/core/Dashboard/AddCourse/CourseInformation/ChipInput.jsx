import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {MdClose} from "react-icons/md"

export const ChipInput = ({
    label, name, placeholder, register, errors, setValue, getValues
}) => {

    const {course, editCourse} = useSelector((state) => state.course)
    const [chips, setChips]  = useState([])

    useEffect(() => {
        if(editCourse) {
            setChips(course?.tag)
        }
        register(name, {required: true, validate: (value) => value.length > 0})
    }, [])

    // // CHECK DURING TESTING
    useEffect(() => {
        setValue(name, chips)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [chips])

    

    const handleKeyDown = (e) => {
        if(e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newChip = e.target.value.trim();
            if(newChip && !chips.includes(newChip)) {
                const newChips = [...chips, newChip]
                setChips(newChips)
                e.target.value = ""
            }
        }
    }

    const handleDeleteChip = (chipIndex) => {
        const newChips = chips.filter((_, index) => index !== chipIndex)
        setChips(newChips)
    }

  return (

    <div className="flex flex-col space-y-2">
        {/* LABEL FOR CHIPS */}
        <label htmlFor={name} className="text-sm text-richblack-5">
            {label}
        </label>

        {/* RENDER THE CHIPS */}
        <div className="flex w-full flex-wrap gap-y-2">
            {chips.map((chip, index) => (
                <div key={index}
                    className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
                >
                    {/* CHIP NAME */}
                    {chip}

                    {/* DELETE BUTTON */}
                    <button
                        type='button'
                        onClick={() => handleDeleteChip(index)}
                        className="ml-2 focus:outline-none"
                    >
                        <MdClose className="text-sm"/>
                    </button>

                </div>
            ))}
        </div>

        {/* INPUT FIELD */}
        <input
            id={name}
            name={name}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className="form-style w-full"
        />
        {errors[name] && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
                {label} is required
            </span>
        )}   
    </div>
  )
}
