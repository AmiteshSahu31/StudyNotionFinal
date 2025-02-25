import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';

function ForgotPassword() {

    const {loading} = useSelector((state) => state.auth);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const dispatch= useDispatch();

    const handleOnSubmit= (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    }


    return (
        <div className='text-white flex items-center justify-center'>
            {
                loading ? (<div>
                    Loading... 
                    </div>) 
                : (<div> 
                    <h1>
                        {
                            !emailSent ? "Reset Your Password" : "Check Email"
                        }
                    </h1>
                    <p>
                        {
                            !emailSent ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery " 
                            : `We have sent the reset email to ${email}`
                        }
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent && (
                                <label>
                                    <p>Email Address*</p>
                                    <input
                                     required
                                     type="email"
                                     name='email'
                                     value={email}
                                     placeholder='Enter your email'
                                     onChange={(e) => setEmail(e.target.value)}
                                     className='text-richblack-900'
                                      />
                                </label>
                            )
                        }
                         <button type='Submit'>
                        {
                            !emailSent? "Submit" : "Resend Email"
                        }
                    </button>
                    </form>
                   

                    <div>
                        <Link to="/login">
                        <p>Back to Login</p>
                        </Link>
                    </div>
                    
                </div>)
            }
        </div>
    )
}

export default ForgotPassword
