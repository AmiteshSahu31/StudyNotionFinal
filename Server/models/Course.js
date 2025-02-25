const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    
    courseName:{
        type:String,
    },
    courseDecsription:{
        type:String,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        //required:true,
        ref: 'User',
    },
    whatYouWillLearn:{
        type: String,
    },
    courseContent:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
        }
    ],
    price:{
        type: Number,
    },
    thumbnail:{
        type: String,
    },
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RatingAndReviews'
    }],
    tag:{
        type:[String],
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
    instructions:{
        type:[String],
    },

    status:{
        type:[String],
        enum:["Draft","Published"],
    }


});

module.exports= mongoose.model("Course", courseSchema);