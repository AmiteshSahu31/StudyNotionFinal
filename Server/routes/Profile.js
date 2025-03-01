const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/authMiddle")
const {
  deleteAccount,
  updateProfile,
  updateDisplayPicture,
  getEnrolledCourses,
  getAllUsers,
} = require("../controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUsers)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router