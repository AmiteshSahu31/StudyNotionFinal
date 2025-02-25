import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import OtpInput from 'react-otp-input';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sendOtp, signUp } from '../services/operations/authAPI';


function VerifyEmail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading,signupData} = useSelector((state) => state.auth);
    const [otp, setOtp] = useState("");

    useEffect(()=>{
        // Only allow access of this route when user has filled the signup form
        if(!signupData){
            navigate('/signup');
        }
    },[])
    

    const handleOnSubmit= (e) => {
        e.preventDefault();
        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        }= signupData;
        dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate));
    }
    return (
        <div className='text-white mx-auto'>
            {
                loading ? (<div> </div>) : 
                     (
                        <div>
                            <h1>Verify Email</h1>
                            <p>A verification code has been sent to you.Enter the code below</p>
                            <form onSubmit={handleOnSubmit}>
                            <OtpInput
                               value={otp}
                               onChange={setOtp}
                               numInputs={6}
                               renderSeparator={<span>-</span>}
                               renderInput={(props) => <input {...props} className='text-richblack-800' />}
                            />
                            <button type="submit">Verify Email</button>
                            </form>

                            <div>
                               <Link to="/login">  
                                  <p>Back to Login</p>
                               </Link>
                               
                            <button
                             onClick={() => dispatch(sendOtp(signupData.email))}>
                                Resend it
                            </button>

                            </div>
                        </div>
                     )

            } 
        </div>
    )
}

export default VerifyEmail
