const mongoose= require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate= require("../mail/emailVerificationTemplate");

const otpSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
});

// Function to send email verification
async function sendEmailVerification(email,otp){
    try {
        const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Pre-save hook to send email verification
otpSchema.pre('save', async function( next) {
    console.log("New document saved to database");

    if (this.isNew) {
    await sendEmailVerification(this.email, this.otp);
    }
    next();
});

module.exports= mongoose.model('OTP',otpSchema);