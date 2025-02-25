import React from 'react'
import HighlightText from './HighlightText'
import KnowYourProgress from '../../../assets/Images/Know_your_progress.png'
import CompareWithOthers from '../../../assets/Images/Compare_with_others.png'
import PlanYourLessons from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from './Button'

function LearningLanguageSection() {
    return (
        <div className='mt-28 mb-24'>
            <div className='flex flex-col gap-5 items-center'>
                <h2 className='text-bold text-4xl'>Your swiss knife for 
                    <HighlightText text={"learning any language"}/>
                </h2>
                <p className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.</p>
                <div className='flex flex-row items-center justify-center '>
                    <img src={KnowYourProgress} alt=""  className='object-contain -mr-32'/>
                    <img src={CompareWithOthers} alt="" className='object-contain '/>
                    <img src={PlanYourLessons} alt=""  className='object-contain -ml-36'/>
                </div>
                <div className='w-fit '>
                    <CTAButton active={true} linkto={"/signup"}> Learn More</CTAButton>
                </div>

            </div>
            
        </div>
    )
}

export default LearningLanguageSection
