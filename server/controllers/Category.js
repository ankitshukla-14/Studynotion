const Category = require("../models/category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.createCategory = async (req, res) => {
    try{
        const {name, description} = req.body;
        if(!name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(categoryDetails);
        return res.status(200).json({
            success: true,
            message: "Category Created Successfully",
        });
    } catch(error) {
        return res.status(500).json({
			success: true,
			message: error.message,
		});
    }
}

exports.showAllCategories = async (req, res) => {
    try{
        const allCategories = await Category.find({});
        return res.status(200).json({
            success: true,
            data: allCategories,
        });
    } catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

exports.categoryPageDetails = async (req, res) => {
    try {
        console.log("REQ BODY", req.body)
        const {categoryId}  = req.body;
        console.log("CATEGORY ID...", categoryId)
        const selectedCategory = await Category.findById(categoryId)
                                .populate({
                                    path: "courses",
                                    match: {status: "Published"},
                                    populate: {
                                        path: "instructor ratingAndReviews",
                                    },                          
                                })
                                .exec()
        console.log("CATEGORY....", selectedCategory)
        if(!selectedCategory) {
            console.log("Category not found")
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        // RETURN IF NO COURSE
        // if(selectedCategory.courses.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "No courses found for selected category"
        //     })
        // }

        const otherCategories = await Category.find({
            _id: {$ne: categoryId}
        })

        let differentCategory = await Category.findOne(
            otherCategories[getRandomInt(otherCategories.length)]. 
            _id
        )
        .populate({
            path: "courses",
            match: {status: "Published"},
            populate: {
                path: "instructor ratingAndReviews",
            }, 
        })
        .exec()

        // TOP-SELLING COURSES
        const allCategories = await Category.find()
                            .populate({
                                path: "courses",
                                match: {status: "Published"},
                                populate: {
                                    path: "instructor ratingAndReviews",
                                }, 
                            })
                            .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourse = allCourses
                                .sort((a, b) => b.sold - a.sold)
                                .slice(0, 10)
        console.log("Most selling courses...", mostSellingCourse)
        
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourse,
            }
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.deleteAllCategories = async (req, res) => {
    try {
      await Category.deleteMany({});
      return res.status(200).json({
        success: true,
        message: "All Categories deleted"
      })
    } catch(error) {
      return res.status(200).json({
        success: false,
        message: error.message
      }) 
    }
  }
  