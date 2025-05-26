import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import getAvgRating from '../../../utils/avgRating'
import RatingStars from '../../common/RatingStars'

export const Course_Card = ({course, Height}) => {

    const [averageRating, setAverageRating] = useState(0)

    useEffect(() => {
        console.log("Course...", course)
        const count = getAvgRating(course.ratingAndReviews)
        setAverageRating(count)
    }, [course])

  return (
    <>
        <Link to={`/courses/${course._id}`}>
            <div className=''>
                <div className='rounded-lg'>
                    <img 
                        src={course?.thumbnail}
                        alt="Course thumbnail"
                        className={`${Height} w-[90%] rounded-xl object-cover`}
                    />
                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5">
                        {course?.courseName}
                    </p>
                    <p className="text-sm text-richblack-50">
                        {course.instructor?.firstName} {course?.instructor?.lastName}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-5">
                            {averageRating || 0}
                        </span>
                        <RatingStars averageRating={averageRating} />
                        <span className="text-richblack-400">
                            {course?.ratingAndReviews?.length} Ratings
                        </span>
                    </div>
                    <p className="text-xl text-richblack-5">
                        Rs. {course?.price}
                    </p>
                </div>
            </div>
        
        </Link>
    
    </>
  )
}

export default Course_Card
