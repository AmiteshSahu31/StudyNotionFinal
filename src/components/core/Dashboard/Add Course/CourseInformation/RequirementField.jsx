import React, { useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function RequirementField({ name , label, register,error, setValue, getValue}) {
    
    const { course, editCourse } = useSelector((state) => state.course);
    const [requirement,setRequirement]= useState("");
    const [requirementList,setRequirementList]= useState([]);

    const handleAddRequirement = () => {
        if(requirement){
            setRequirementList([...requirementList, requirement]);
            setRequirement("");
        }
    }
    
    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = [...requirementList];
            updatedRequirementList.splice(index,1);
            setRequirementList(updatedRequirementList);
    }

    useEffect(() => {
        if (editCourse) {
          setRequirementList(course?.instructions)
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    useEffect(() => {
        setValue(name, requirementList)
    }, [requirementList])


    return (
        <div>
            <label htmlFor={name} className='text-sm text-richblack-5'>{label}<sup>*</sup></label>
            <input 
            type="text"
            id={name}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            className="form-style w-full"
             />

             <button type='button'
             onClick={handleAddRequirement}
             className='font-semibold text-yellow-50'>Add</button>

             {
                requirementList?.length > 0 && (
                    <ul>
                        {requirementList.map((requirement,index) =>{
                            return (
                                <li key={index}>
                                    <span className='text-richblack-5'>{requirement}</span>
                                    <button 
                                    type='button' 
                                    onClick={() => handleRemoveRequirement(index)}
                                    className=' ml-2 text-xs text-pure-greys-300'>Clear</button>
                                </li>
                            )
                        })}
                    </ul>
                )
             }
            
        </div>
    )
}

export default RequirementField
