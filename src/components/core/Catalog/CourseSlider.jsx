import React from 'react'
import {Swiper, SwiperSlide} from "swiper/react"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

import { Autoplay, FreeMode, Pagination } from "swiper"
import { Course_Card } from './Course_Card'

export const CourseSlider = ({Courses}) => {
  return (
    <>
        {Courses?.length ? (
            <Swiper 
                slidesPerView={3}
                spaceBetween={25}
                loop={true}
                autoplay={{
                    delay: 2500, 
                    disableOnInteraction: false
                }}
                modules={[Pagination, Autoplay]}

                className='max-h-[30rem]'
            >
                {Courses?.map((course, i) => (
                    <SwiperSlide key={i} >
                        <Course_Card course={course} Height={"h-[250px]"} />
                    </SwiperSlide>
                ))}
            </Swiper>
        ) : (
            <p className='text-x1 text-richblack-5'>
                No Courses Found
            </p>
        )}
    
    </>
  )
}
