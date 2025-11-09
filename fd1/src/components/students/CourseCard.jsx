import React, { useContext } from 'react'
import { assets } from '../../assets/assets/assets'
import { AppContext } from '../../context/Appcontext'
import { Link } from 'react-router-dom'

function CourseCard({ course }) {
  const { currency, findRating } = useContext(AppContext);

  const ratingValue = findRating(course);
  const totalRatings = Array.isArray(course.courseRatings) ? course.courseRatings.length : 0;

  return (
    <Link 
      to={`/Course-Detail/${course._id}`} 
      onClick={() => window.scrollTo(0,0)} 
      className='border-gray-500/30 border pb-6 overflow-hidden rounded hover:shadow-md transition'>
      
      <img className='w-full h-48 object-cover' src={course.courseThumbnail} alt='' />
      <div className='p-3 text-left'>
        <h3 className='font-semibold text-base'>{course.courseTitle}</h3>
        <p className='text-sm text-gray-600'>{course.educator?.name || "Unknown Educator"}</p>

        <div className='flex gap-3 mx-auto items-center'>
          <p>{ratingValue}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img 
                key={i} 
                src={i < Math.floor(ratingValue) ? assets.star : assets.star_blank} 
                className='w-3.5 h-3.5' 
                alt='' 
              />
            ))}
          </div>
          <p className='text-gray-500'>
            {totalRatings > 0 ? `${totalRatings} ratings` : "No ratings"}
          </p>
        </div>

        <p className='text-base font-semibold text-gray-800'>
          {currency}{(course.coursePrice - (course.discount * course.coursePrice / 100)).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

export default CourseCard;
