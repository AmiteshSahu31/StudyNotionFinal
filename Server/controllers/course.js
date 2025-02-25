const Course= require("../models/Course");
const User= require("../models/Users");
const Category= require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create course handler
exports.createCourse= async(req,res) => {
    try {
        const {courseName, courseDescription, whatYouWillLearn, price,tag,category,
             status, instructions} =req.body;
        const thumbnail= req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success: false,
                message: 'All fields are requirehhb',
            });
        }
        //check for instructor
        const userId= req.user.id;
        const instructorDetails= await User.findById(userId,
            {accountType: "Instructor",});
        console.log("Instructor Details: " , instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: 'Instructor Details not found',
            });
        }
        
        //check given category is valid or not
        const categoryDetails= await Category.findById(category); //here category is written as in Course model category objectId is present
        if(!categoryDetails){
            return res.status(400).json({
                success: false,
                message: 'Category Details not found',
            });
        }

        //upload image to cloudinary
        const thumbnailImage= await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        
        //create an entry for new Course
        const newCourse= await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            thumbnail: thumbnailImage.secure_url,
            instructor: instructorDetails._id,
            category: categoryDetails._id,
            tag:tag,
            status:status,
            instructions:instructions,
        })

        //add the newcourse to instructor user schema
        await User.findByIdAndUpdate({_id: instructorDetails._id},
            {
                $push:{ courses: newCourse._id,}
            },
            {new:true,}
        )

        //update course in category schema
        await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);


        return res.status(200).json({
            success: true,
            message: 'Course created successfully',
            newCourse,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
        
    }
}

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
      console.log("course:",course);
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();

      console.log("updated course details: ", updatedCourse);
        
      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

//getAllCourses handler
exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};


//getCourseDetails
exports.getCourseDetails = async(req,res) => {
    try {
        //get courseid
        const {courseId}=req.body;
        //validation
        if(!courseId) {
            return res.status(404).json({
            success: false,
            message: 'Course id is required',
        });
    }
        //find courseDetails
        const courseDetails= await Course.find({_id: courseId})
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails",
            },
        })
        .populate("category")
        //.populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        }).exec()

        //validation
        if(!courseDetails){
            return res.status(404).json({
            success: false,
            message: `Course not found with ${courseId}`,
        });
    }
    console.log("courseDetails: " , courseDetails);
    

        return res.status(200).json({
            success: true,
            message: 'Course details fetched successfully',
            courseDetails,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });   
    }
}