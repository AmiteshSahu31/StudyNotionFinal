const SubSection= require('../models/SubSection');
const Section= require('../models/Section');
const {uploadImageToCloudinary}= require('../utils/imageUploader');

exports.createSubSection= async(req,res) => {
    try {
        //fetch the data from req
        const {title,description,sectionId}= req.body;
        //extract video file
        const video= req.files.videoFile;
        //validation
        if(!title || !description  || !video || !sectionId){
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        //upload video to cloudinary and get the secure url
        const uploadDetails= await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create subsection
        const subSectionDetails= await SubSection.create({
            title:title,
            description:description,
            timeDuration:`${uploadDetails.duration}`,
            videoUrl:uploadDetails.secure_url,
        });
        //update the subsection in section objectID
        const updatedSection= await Section.findByIdAndUpdate({_id:sectionId},
            {$push: {subSection: subSectionDetails._id}},
            {new:true},
        ).populate("subSection");
        
        //return response
        return res.status(200).json({
            success:true,
            message: 'SubSection created successfully',
            data:updatedSection,
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to create subsection, please try again',
            error: error.message,
        })
    }
}

//updateSubSection handler
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, subSectionId, title, description } = req.body
      // console.log("body",req.body.title, req.body.description)
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
      console.log("updated section", updatedSection)
  
      return res.json({
        success: true,
        message: "Section updated successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }
  

//deleteSUbSection handler

exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      const updatedSection= await Section.findByIdAndUpdate(
        sectionId,
        {
          $pull: {
            subSection: subSectionId,
          },
        },{new:true}
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }
