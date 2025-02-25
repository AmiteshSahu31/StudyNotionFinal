const {instance} =require("../config/razorpay");
const Course= require("../models/Course");
const User= require("../models/Users");
const mailSender= require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/courseEnrollmentEmail");

//capture the payment and initiate the razorpay order
exports.capturePayment= async(req,res) => {
    try {
        //get the course id and user id
        const {course_id}=req.body;
        const userId= req.user.id;
        //validation
        //valid courseid
        if(!course_id){
            return res.json({
                success: false,
                message: 'Please provide a valid course ID',
            })
        }
        //valid coursedetails
        let course;
        try {
            course= await Course.findById(course_id);
            if(!course){
                return res.json({
                    success: false,
                    message: 'Course not found',
                });
            }

            //user already pay for the same course
            const uid= new mongoose.Types.ObjectId(userId); // convert userid from string to objectid

            if(course.studentsEnrolled.includes(uid)){
                return res.json({
                    success: false,
                    message: 'You have already enrolled in this course',
                });
            }            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
       
        //create order
        const amount=course.price;
        const currency= "INR";

        const options={
            amount: amount*100, //mandatory
            currency, // mandatory
            receipt:Math.random(Date.now()).toString(), //optional
            notes:{
                courseId:course_id,
                userId,
            } // optional
        }

        try {
            //initiate the payment using razorpay
            const paymentResponse= await instance.orders.create(options);
            console.log(paymentResponse);

            //return response
            return res.json({
                success: true,
                courseName:course.courseName,
                courseDescription:course.courseDecsription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount,

            });
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });    
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
        
    }
};

//verify signature of razorpay and server
exports.verifySignature= async(req,res) => {
    const webHookSecret="12345678";
    // secretkey of razorpay
    const signature= req.headers["x-razorpay-signature"];

    const shasum= crypto.createHmac("sha256", webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest= shasum.digest("hex");

    if(signature === digest){
        console.log('payment authorized');

        const {courseId,userId} = req.body.payload.payment.entity.notes;

        try {
            //fulfill the action
            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push: {studentsEnrolled:userId}},
                {new:true,}
            )

            //find the student and update the course in it
            const enrolledStudent= await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true},
            )
            console.log(enrolledStudent);

            const emailResponse = await mailSender(enrolledStudent.email,
                                                    "congratulations for your enrollment",
                                                    "Congratulations,you have been enrolled in the new course "
                                                );

            console.log(emailResponse);

            return res.json({
                success: true,
                message: 'Signature verified and course enrolled successfully',
            });                                    
            
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
            
        }
        
    }
};