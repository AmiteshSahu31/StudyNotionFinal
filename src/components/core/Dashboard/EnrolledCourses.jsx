import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';

function EnrolledCourses() {
    const {token} = useSelector((state) => state.auth);

    const [enrolledCourses,setEnrolledCourses] = useState(null);
    
    const getEnrolledCourses =async() => {
        try {
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response);   
        } catch (error) {
            console.log("Unable to fetch enrolled courses successfully");
            
        }
    }

    useEffect(() => {
       getEnrolledCourses(token); 
    },[])
    return (
        <div>
            <div>Enrolled Courses</div>
            {
                !enrolledCourses ? (
                    <div>Loading...</div>
                ) : (
                    <div></div>
                )
            }
            
        </div>
    )
}

export default EnrolledCourses
