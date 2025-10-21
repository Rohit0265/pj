import React, { useContext } from 'react'
import { assets } from '../../assets/assets/assets'
import { AppContext } from '../../context/Appcontext'
import { Link } from 'react-router-dom'

function CourseCard({course}) {
        const {currency,findRating} = useContext(AppContext)
  return (
    <Link to={'/Course-Detail/'+ course._id} onClick={()=>{scrollTo(0,0)}} className='border-gray-500/30 border pb-6 overflow-hidden rounded'>
        <img className='w-full' src={course.courseThumbnail} alt="" />
        <div className='p-3 text-left'>
            <h3 className='font-semibold text-base'>{course.courseTitle}</h3>
            <p>{course.educator.name}</p>
            <div className='flex gap-3 mx-auto items-center'>
                <p>{findRating(course)}</p>
                <div className='flex'>
                    {[...Array(5)].map((_,i)=>(<img key={i} src={i<Math.floor(findRating(course)) ? assets.star : assets.star_blank} className='w-3.5 h-3.5' alt='' />))}
                </div>
                <p className='text-gray-500'>{course.courseRatings.length}</p>
            </div>
            <p className='text-base font-semibold text-gray-800'>{currency}{(course.coursePrice - course.discount * course.coursePrice /100).toFixed(2)}</p>
        </div>
    </Link>
  )
}

export default CourseCard