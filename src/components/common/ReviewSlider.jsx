import React, { useEffect, useState } from 'react'
import { getAllRatingAndReviews } from '../../services/operations/courseDetailsAPI'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import "../../App.css"
import { Autoplay, FreeMode, Pagination } from "swiper"
import ReactStars from "react-rating-stars-component"
import { FaStar } from 'react-icons/fa'

export const ReviewSlider = () => {

    const [reviews, setReviews] = useState([])
    const trucnateWords = 15
    const fetchReviews = async () => {
        const res = await getAllRatingAndReviews()
        console.log("RES...", res)
        setReviews(res)
    }

    useEffect(() => {
        fetchReviews()
        console.log("asjb", reviews);
    }, [])


  return (
    <div className="text-white mt-[50px] mb-[50px] w-11/12 mx-auto max-w-maxContent">
        <div classNameName="my-[50px] h-[184px]  lg:max-w-maxContent">
            <Swiper
                slidesPerView={3}
                spaceBetween={25}
                modules={[Autoplay]}
                // loop={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false
                    
                }}
                className='w-full'

            >
              {reviews.map((review, i) => {
                return (
                    <SwiperSlide key={i}>
                        <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 w-full">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={review?.user?.image 
                                            ? review?.user?.image
                                            : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                                        }
                                    className='h-9 w-9 rounded-full object-cover'
                                />
                                <div className="flex flex-col">
                                    <h1 className="font-semibold text-richblack-5">
                                        {`${review?.user?.firstName} ${review?.user?.lastName}`}
                                    </h1>
                                    <h2 className="text-[12px] font-medium text-richblack-500">
                                        {review?.course?.courseName}
                                    </h2>
                                </div>
                            </div>
                            <p className="font-medium text-richblack-25">
                                {review?.review.split(" ").length > trucnateWords 
                                    ? `${review?.review.split(" ")
                                        .slice(0, trucnateWords)
                                        .join(" ")}...`
                                    : `${review?.review}`}
                            </p>
                            <div className="flex items-center gap-2 ">
                                <h3 className="font-semibold text-yellow-100">
                                    {review.rating.toFixed(1)}
                                </h3>
                                <ReactStars 
                                    count={5}
                                    value={review.rating}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<FaStar />}
                                    fullIcon={<FaStar />}
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                )
              })}

            </Swiper>
        </div>
    </div>
  )
}
