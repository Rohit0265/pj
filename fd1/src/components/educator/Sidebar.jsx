import React from 'react'
import { assets } from '../../assets/assets/assets'
import { NavLink } from 'react-router-dom'

function Sidebar() {

    const eduDash = [
        {name :'Dashboard', path:'/educator/dashboard' ,icon : assets.home_icon},
        {name :'Add Course', path:'/educator/add-course' ,icon : assets.add_icon},
        {name :'My Courses', path:'/educator/my-course' ,icon : assets.my_course_icon},
        {name :'Student Enrolled', path:'/educator/student-enrolled' ,icon : assets.person_tick_icon}
    ]

  return (
    <div>
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col '>
            {eduDash.map((item)=>(
                <NavLink
                to={item.path}
                key={item.name}
                end={item.path === '/educator'}
                className={({isActive})=> `flex items-center md:flex-row flex-col md:justif-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' : 'hover:bg-gray-100/9- border-r-[6px] border-white hover:border-gray-100/90'}`}>
                    <img src={item.icon} alt="" />
                    <p className='md:block hidden text-center'>{item.name}</p>
                </NavLink>
            ))}
        </div>

    </div>
  )
}

export default Sidebar