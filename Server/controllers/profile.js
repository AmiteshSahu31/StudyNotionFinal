const Profile= require('../models/Profile');
const User= require('../models/Users');
const {uploadImageToCloudinary} =require("../utils/imageUploader");


exports.updateProfile= async(req,res) => {
    try {
        //get data
        const {gender,DOB="",about="",contactNo} = req.body;
        //get userId
        const id = req.user.id;
        //validation
        if(!DOB || !about || !contactNo){
            return res.status(400).json({
                success:false,
                message: 'All fields are required',
            });
        }

        //find profile by id
        const userDetails= await User.findById(id);
        const profileId= userDetails.additionalDetails;
        const profileDetails= await Profile.findById(profileId);

        //update profile
        profileDetails.DOB=DOB;
        profileDetails.about=about;
        profileDetails.contactNo=contactNo;

        await profileDetails.save();

        return res.status(200).json({
            success:true,
            message: 'Profile updated successfully',
            profileDetails,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
        
    }
}

//Delete account handler
//Explore: how can we schedule this operation

exports.deleteAccount= async(req,res) => {
     try {
        //get userid
        const id =req.user.id;
        //validation
        const userDetails=await User.findById({_id:id});
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        //delete Profile 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        //TODO HW: unenroll user from all enrolled courses

        //delete user
        await User.findByIdAndDelete({_id: id});

        return res.status(200).json({
            success:true,
            message:"user deleted successfully",
        });
        
     } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user not deleted successfully",
        });
     }
}

//getAllUSers HAndler
exports.getAllUsers= async(req,res) =>{
    try{
        const id=req.user.id;

        const userDetails= await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            userDetails,
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }

}

//extra

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};