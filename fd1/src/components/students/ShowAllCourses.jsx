import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/Appcontext'
import CourseCard from './CourseCard'



function ShowAllCourses() {

    const {allCourse} = useContext(AppContext)
    return (
    <div className='text-center pt-10'>
        <h1 className='text-bold text-3xl'>Learn from the best</h1>
       <p className='pt-4 pb-8 text-gray-600/80'>
Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
        </p> 
        <div className='grid custom-grid gap-5 ml-10 mb-10 mr-10'>
            {allCourse.slice(0,4).map((course,index)=> <CourseCard key={index} course={course}/>)}
        </div>
        <Link  to={"/course-list"} className='border rounded-md text-gray-500/80 pt-2 mt-2 pb-2 pr-5 pl-5 border-gray-500/80' onClick={()=>{onscroll(0,0)}}>Show all courses</Link>
    </div>
  )
}

export default ShowAllCourses