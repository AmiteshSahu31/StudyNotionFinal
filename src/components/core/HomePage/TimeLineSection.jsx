import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timeLineImage from '../../../assets/Images/TimelineImage.png'

const timeLine=[
    {
        Logo:Logo1,
        Heading:"Leadership",
        Description:"Fully committed to the success company "
    },
    {
        Logo:Logo2,
        Heading:"Leadership",
        Description:"Fully committed to the success company "
    },
    {
        Logo:Logo3,
        Heading:"Leadership",
        Description:"Fully committed to the success company "
    },  {
        Logo:Logo4,
        Heading:"Leadership",
        Description:"Fully committed to the success company "
    }
]

function TimeLineSection() {
    return (
        <div>
            <div className='flex gap-[75px] items-center  '>
                <div className='flex flex-col w-[40%] gap-5'>
                    {
                        timeLine.map((element,index) => {
                            return (
                                <div className='flex gap-6 ' key={index}>
                                    <div className='flex items-center justify-center h-[52px] w-[52px] bg-white rounded-full '>
                                        <img src={element.Logo} alt='Logo' />
                                    </div>

                                    <div className='flex flex-col '>
                                        <h2 className='text-[18px] font-semibold'>{element.Heading}</h2>
                                        <p className='text-base'>{element.Description}</p>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
                <div className='relative shadow-blue-200'>
                    <img src={timeLineImage} alt="timeLineImage"
                    className='shadow-white object-cover h-[400px] lg:h-fit' />

                    <div className='absolute bg-caribbeangreen-700 uppercase py-7 flex translate-x-[-50%] translate-y-[-50%] left-[50%] w-[80%]'>
                        <div className='flex gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                            <p className='text-3xl font-bold text-white'>10</p>
                            <p className='text-sm text-caribbeangreen-300'>Years of Experience</p>
                        </div>
                        <div className='flex gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                            <p className='text-3xl font-bold text-white'>250</p>
                            <p className='text-sm text-caribbeangreen-300'>types of courses</p>
                        </div>
                    </div>

                </div>
            </div>

            
        </div>
    )
}

export default TimeLineSection
