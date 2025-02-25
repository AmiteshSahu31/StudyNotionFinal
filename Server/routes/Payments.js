// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature } = require("../controllers/payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/authMiddle")

// Routes
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifySignature", verifySignature)

module.exports = router