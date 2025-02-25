import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI';
import { useLocation } from 'react-router-dom';
import { IoMdEye, IoMdEyeOff} from "react-icons/io";
import { Link } from 'react-router-dom';
import { useState } from 'react';

function UpdatePassword() {
    const location= useLocation();
    const dispatch= useDispatch();
    const {loading}= useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formdata,setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const { password, confirmPassword } = formdata;
    const handleOnChange=(e) => {
        setFormData((prevData) => ({
           ...prevData,
            [e.target.name]: e.target.value
        }));
    }
    const handleOnSubmit= (e) => {
        e.preventDefault();
        const token= location.pathname.split('/').at(-1)
        dispatch(resetPassword(password ,confirmPassword,token));
    }

    return (
        <div className='text-white flex items-center justify-center'>
            {
              loading ? (
                <div>
                    Loading...
                </div>
              ) :(
                <div>
                    <h1>Choose new Password</h1>
                    <p>Almost done. Enter your new password and you are all set</p>
                    <form onSubmit={handleOnSubmit}>
                        <label>
                            <p>New Password <sup>*</sup></p>
                            <input
                            required 
                            type= {showPassword ? "text" : "password"}
                            name='password'
                            value={password}
                            onChange={handleOnChange}
                            className='text-richblack-900'
                            />
                            <span onClick={() => setShowPassword((prev) => !prev)}>
                                {
                                    showPassword ? <IoMdEyeOff /> : <IoMdEye />
                                }
                            </span>
                        </label>
                        <label>
                            <p> Confirm New Password <sup>*</sup></p>
                            <input
                            required 
                            type= {showConfirmPassword ? "text" : "password"}
                            name='confirmPassword'
                            value={confirmPassword}
                            onChange={handleOnChange}
                            className='text-richblack-900'
                            />
                            <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                {
                                    showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />
                                }
                            </span>
                        </label>
                        <button 
                        type='submit'>Reset Password</button>
                    </form>
                    <div>
                    <Link to="/login">  
                       <p>Back to Login</p>
                    </Link>
                    </div>
                </div>
              )
            }

            
        </div>
    )
}

export default UpdatePassword
