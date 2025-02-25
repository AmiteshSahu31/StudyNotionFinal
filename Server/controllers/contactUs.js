const {contactUsEmail} = require("../mail/contactFormRes");
const {mailSender}= require("../utils/mailSender");

//Handler
exports.contactUs=async(req) => {
    try {
        const {firstName, lastName, email, phoneNo, message} = req.body;
        
        //validation
        if( !firstName || !lastName || !email || !phoneNo || !message ){
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            })
        }

        //send email
        const emailResponse = await mailSender(email, "Your mail has been sent successfully", 
            contactUsEmail(firstName, lastName, email, phoneNo, message)
        );
        
        console.log(emailResponse);
        
        return res.json({
            success: true,
            message: 'Email sent successfully',
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}