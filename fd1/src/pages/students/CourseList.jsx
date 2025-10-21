import React, { useContext, useEffect ,useState } from 'react'

import Fotter from '../../components/students/Fotter'
import { AppContext } from '../../context/Appcontext'
import Searchbar from '../../components/students/Searchbar'
import { useFetcher, useParams } from 'react-router-dom'
import CourseCard from '../../components/students/CourseCard'
import { assets } from '../../assets/assets/assets'

function CourseId() {
  const input = useParams()
  const {navigate,allCourse} = useContext(AppContext)

  const [filter,setFilter] = useState([]);

  useEffect(()=>{
    if(allCourse && allCourse.length >0){
      const tempCourse = allCourse.slice();
      input ?
      setFilter(allCourse.filter(item => item.courseTitle.toLowerCase().includes((input.id || '').toLowerCase())))
      :
      setFilter(tempCourse);
    }
},[allCourse,input])

  return (
  <div>
    <div className='md:flex pt-15 pl-20 justify-between pr-25'>

      {/* this is top bar course home wagera etc  */}

    <div>
    <h1 className='font-semibold text-4xl'>Course List</h1>
    <span onClick={()=> navigate("/")} className='text-blue-500 underline cursor-pointer'>Home</span>/<span>Courses</span>

    {/* this is search bar */}

    </div>
    <div className=''><Searchbar value={input}/></div>
    </div>

    {/* Cross icon for clearing filter */}
    {input && input.id && (
      <div className='flex items-center mt-8 ml-10'>
        <div className='flex items-center border rounded px-3 py-1 gap-2 '>
          <p className='font-semibold text-xl'>{input.id}</p>
          <img
            width={17}
            src={assets.cross_icon}
            onClick={() => navigate("/course-list")}
            alt=""
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    )}
    {/* ye hai all course dikhane ke liye okkkkk */}


    <div className='grid sm:grid-2 md:grid-cols-3 lg:grid-4 gap-5 ml-15 mb-10 mr-15 mt-20'>
      {filter.map((course,index)=>  <CourseCard key = {index} course={course} />
      )}
    </div>
      <Fotter/>
    </div>
  )
}

export default CourseId