import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsCompleted } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slice/viewCourseSlice';
import { BigPlayButton, Player } from 'video-react';
import IconBtn from '../../common/IconBtn';
import "video-react/dist/video-react.css"


export const VideoDetails = () => {

  const {courseId, sectionId, subSectionId} = useParams();
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const playRef = useRef()
  const {token} = useSelector((state) => state.auth)
  const {courseEntireData, courseSectionData, completedLectures} = useSelector((state) => state.viewCourse)
  const [videoData, setVideoData] = useState("")
  const [play, setPlay] = useState(false)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        // console.log("courseSectionData", courseSectionData)
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        // console.log("filteredData", filteredData)
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        // console.log("filteredVideoData", filteredVideoData)
        setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  
  const isFirstVideo = () => {
    const currSectionIdx = courseSectionData.findIndex(
      (section) => section._id === sectionId
    )

    const currSubSectionIdx = courseSectionData[
      currSectionIdx
    ].subSection.findIndex((subSection) => subSection._id === subSectionId)

    if (currSectionIdx === 0 && currSubSectionIdx === 0) {
      return true
    } else {
      return false
    }
  }

  const isLastVideo = () => {
    const currSectionIdx = courseSectionData.findIndex(
      (section) => section._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currSectionIdx].subSection.length

    const currSubSectionIdx = courseSectionData[
      currSectionIdx
    ].subSection.findIndex((subSection) => subSection._id === subSectionId)

    if (
      currSectionIdx === courseSectionData.length - 1 &&
      currSubSectionIdx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  const goToNextVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    // console.log("no of subsections", noOfSubsections)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  const goToPrevVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsCompleted(
      {courseId, subSectionId},
      token
    )
    console.log("Dispatching action")
    console.log("Completed Lectures..", completedLectures)

    if(res) {
      console.log("Dispatching action")
      dispatch(updateCompletedLectures(subSectionId))
      console.log("Completed Lectures..", completedLectures)
    }
    console.log("Action dispatched")

    setLoading(false)
  }

  useEffect(() => {
    console.log("Completed lectures updated:", completedLectures);
    // Any logic based on new completedLectures
  }, [completedLectures]);

  return (
    <div className="flex flex-col gap-5 text-white">
        {!videoData ? (
          <img 
            src={previewSource}
            alt='Preview'
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <Player
            ref={playRef}
            // aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
            autoPlay={play}
          >
            <BigPlayButton position="center"/>

            {videoEnded && (
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                }}
                className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
              
              >
                {/* MARK AS COMPLETE BUTTON */}
                {!completedLectures.includes(subSectionId) && (
                  <IconBtn 
                    disabled={loading}
                    onclick={() => handleLectureCompletion()}
                    text={!loading ? "Mark as Completed" : "Loading..."}
                    customClasses="text-xl max-w-max px-4 mx-auto"
                  />
                )}
                
                {/* PLAY AGAIN BUTTON */}
                <IconBtn 
                  disabled={loading}
                  onclick={() => {
                    if(playRef.current) {
                      playRef?.current?.seek(0)
                      setPlay(true)
                      setVideoEnded(false)
                    }
                  }}
                  text="ReWatch"
                  customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                />
                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                  {!isFirstVideo() && (
                    <button
                      onClick={goToPrevVideo}
                      className="blackButton"
                    >
                      Prev
                    </button>
                  )}
                  {!isLastVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className="blackButton"
                    >
                      Next
                    </button>
                  )}
                </div>           
              </div>
            )}
          </Player>
        )}
        <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
        <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}
