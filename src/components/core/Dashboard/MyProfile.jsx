import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../common/IconBtn';
import { useNavigate } from 'react-router-dom';

function MyProfile() {

    const {user} = useSelector((state) => state.profile);
    const navigate = useNavigate();
    return (
        <div className='text-white'>
             <h1 className=' text-3xl font-semibold '>My Profile</h1>
             
            <div className=' flex justify-between items-center p-5'>
                <div className='flex gap-x-5 items-center'>
                    <img src={user?.image} 
                         alt={`profile-${user?.firstName}`}
                         className='aspect-square object-cover rounded-full w-[78px]' />
                    <div>
                        <p>{user?.firstName + " " + user?.lastName}</p>
                        <p>{user?.email}</p>
                    </div>
                </div>
                <IconBtn
                    text={"Edit"}
                    onclick={() => navigate("dashboard/settings")}/>
            </div>
        </div>
    )
}

export default MyProfile
