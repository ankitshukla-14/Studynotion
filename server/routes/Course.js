const express = require("express");
const router = express.Router();

const {createCourse, editCourse, getAllCourses, getCourseDetails, getInstructorCourses, deleteCourse, getFullCourseDetails, deleteAllCourses} = require("../controllers/Course");
const {createCategory, showAllCategories, categoryPageDetails, deleteAllCategories} = require("../controllers/Category");
const {createSection, updateSection, deleteSection} = require("../controllers/Section");
const {createSubSection, updateSubSection, deleteSubSection} = require("../controllers/Subsection");
const {createRating, getAverageRating, getAllRating} = require("../controllers/RatingAndReview");

const {auth, isInstructor, isStudent, isAdmin} = require("../middlewares/auth");
const { updateCourseProgress } = require("../controllers/CourseProgress");

// category routes only by admin
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails)
router.delete("/deleteAllCategories", auth, isAdmin, deleteAllCategories)


router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse", auth, isInstructor, editCourse);
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);
router.delete("/deleteAllCourses", auth, isInstructor, deleteAllCourses)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;




