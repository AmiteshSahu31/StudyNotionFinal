//  //auth , isStudent, isAdmin, isInstructor

//  const jwt= require('jsonwebtoken');
//  require("dotenv").config();
//  const User= require("../models/Users");
 
//  exports.auth= async (req,res,next) => {
//      try {         
//          //extract jwt token
//          const token = req.body.token || req.cookie.token || req.header("Authorization".replace("Bearer ", "")); 
//          console.log("Extracted Token:", token);
 
//          if(!token) {
//              res.status(401).json({
//                  success:false,
//                  message: "Token missing",
//              })
//          }
 
//          //verify token
//        try {
//          const decode = jwt.verify(token, process.env.JWT_SECRET);
//          console.log(decode);
 
//          req.user=decode;
 
//        } catch (error) {
//          return res.status(401).json({
//              success: false,
//              message: "Token invalid",
//          });    
//        }
//        next();
 
         
//      } catch (error) {
//          return res.status(401).json({
//              success: false,
//              message: "Something went wrong ,while validating the token",
//          });
         
//      }
//  }

const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/Users");

exports.auth = async (req, res, next) => {
  try {
    // Extract the token from multiple possible sources
    const token =
      req.body.token ||
      req.cookies?.token ||
      (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]);

    console.log("Extracted Token:", token); // Debugging log

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // Debugging log
      req.user = decoded; // Attach decoded user to request
    } catch (error) {
      console.error("JWT Verification Error:", error.message); // Detailed error log
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.error("Auth Middleware Error:", error); // Log unexpected errors
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying the token",
    });
  }
};

 
 exports.isStudent= (req,res,next) => {
     try {
         if(req.user.accountType !== "Student"){
             return res.status(401).json({
                 success:false,
                 message: "This is a protected route for students"
             })
         }
         next();
         
     } catch (error) {
         return res.status(500).json({
             success: false,
             message: "Something went wrong while verifying the user role"
         });
         
     }
 }
 
 exports.isAdmin= (req,res,next) => {
     try {
         if(req.user.accountType!== "Admin"){
             return res.status(401).json({
                 success:false,
                 message: "This is a protected route for admins"
             })
         }
         next();
         
     } catch (error) {
         return res.status(500).json({
             success: false,
             message: "Something went wrong while verifying the user role"
         });
         
     }
 }

 exports.isInstructor= (req,res,next) => {
    try {
        if(req.user.accountType!== "Instructor"){
            return res.status(401).json({
                success:false,
                message: "This is a protected route for instructor"
            })
        }
        next();
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying the user role"
        });
        
    }
}