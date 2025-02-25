import React from 'react'

const Stats= [
    { count: "5K" , name: "Active Students"},
    { count: "10+" , name: "Mentors"},
    { count: "200+" , name: "Courses"},
    { count: "50+" , name: "Awards"},
];

function StatsComponent() {
    return (
        <section>
            <div>
                <div className='flex gap-x-4'>
                    {
                        Stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center gap-2">
                                <h1>{stat.count}</h1>
                                <h1>{stat.name}</h1>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default StatsComponent
