const Section= require('../models/Section');
const Course= require('../models/Course');
const SubSection= require('../models/SubSection');

exports.createSection= async(req,res) => {
    try {
        const {sectionName, courseId}= req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message: 'All fields are required',
            });
        }

        //create a new section
        const section= await Section.create({sectionName});

        //update course with section Object id
         const updatedCourseDetails=await Course.findByIdAndUpdate(courseId, {
            $push:{
                courseContent: section._id,
            }},
           {new:true},
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();
        console.log("updatedcourse details: " , updatedCourseDetails);
        

        res.status(200).json({
            success:true,
            message: 'Section created successfully',
            updatedCourseDetails,
        });

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create section, please try again",
            error:error.message
        })
        
    }
}


//updateSection handler
exports.updateSection= async(req,res) => {
    try {
        const {sectionName, sectionId} = req.body;

        if(!sectionName ||!sectionId){
            return res.status(400).json({
                success:false,
                message: 'All fields are required',
            });
        }

        const updatedSectionDetails= await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        return res.status(200).json({
            success:true,
            message: "Section updated successfully",
            updatedSectionDetails,
        }
        )
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Unable to update section, please try again",
            error: error.message
        })       
    }
}

//deleteSection handler
// exports.deleteSection= async(req,res) => {
//     try {
//         //get the id ,here we are sending the id in params(now changed to body)
//         const {sectionId,courseId} = req.body;
//         // console.log("section", courseId)

//         await Section.findByIdAndDelete(sectionId);
//         //TODO: do we need to delete the entry from the course schema (will do in testing)//
//         const updatedCourse = await Course.findByIdAndUpdate(courseId,
//             { $pull: { courseContent: sectionId } },{new: true}
//         );
        

//         console.log(updatedCourse)
//         return res.status(200).json({
//             success:true,
//             message: "Section deleted successfully",
//             data: updatedCourse
//         })
        
//     } catch (error) {
//         return res.status(500).json({
//             success:false,
//             message: "Unable to delete section, please try again",
//             error: error.message
//         })
        
//     }
// }

exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   