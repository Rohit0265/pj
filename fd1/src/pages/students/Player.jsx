import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/Appcontext';
import humanizeDuration from 'humanize-duration';
import { assets } from '../../assets/assets/assets';
import YouTube from 'react-youtube';
import Fotter from '../../components/students/Fotter';
import Rating from '../../components/students/Rating'

function Player() {

  const [arrow,setarrow] = useState({})
  const {CourseId} = useParams();
  const {isEnrolled,chapterduration} = useContext(AppContext)
  const [player,setPlayer] = useState({ lectureUrl: "" })
  
  const [data , setdata] = useState(null);

const courseData = ()=>{ 
  const foundCourse = isEnrolled.find(course => course._id === CourseId);
  if (foundCourse) {
    setdata(foundCourse); // store the course object, not just ID
  }
};

  const updowm = (index) => {
    setarrow((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  

  useEffect(() => {
    courseData();
  }, [isEnrolled])
  


  return (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>

        {/* right column  */}

        <div className='text-gray-800'>
          <div className='text-3xl font-semibold pb-8'>
            <h1>Course Structure</h1>
          </div>
          <div>
            {data && data.courseContent.map((chapter, index) => (
              <div className='border border-gray-500 mb-2 mr-20 bg-white rounded' key={index}>
                <div onClick={() => updowm(index)} className='flex px-2 py-2 select-none items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <img src={arrow[index] ? assets.down_arrow_icon_rotated : assets.down_arrow_icon} alt="" />
                    <p className='font-medium text-sm md:text-base'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-sm font-semibold'>{chapter.chapterContent.length} lectures - {chapterduration(chapter)}</p>
                </div>
                <div className={`overflow-hidden ${arrow[index] ? "max-h-96" : "max-h-0"} transition-all duration-300`}>
                  <ul className='md:pl-10 pl-4 pr-4 py-2 border-t justify-between border-gray-300'>
                    {chapter.chapterContent.map((lecture, chapterIndex) => (
                      <li className='text-gray-800 pb-2 pt-3 text-xs md:text-default' key={chapterIndex}>
                        <div className='flex justify-between items-center'>
                          <div className='flex gap-2'>
                            <img src={assets.play_icon} alt="" />
                            <p className='cursor-pointer text-sm hover:underline'>{lecture.lectureTitle}</p>
                          </div>
                          <div className='flex gap-2'>
                            {lecture.lectureUrl && <p onClick={() => {

                              setPlayer(() => {
                                return {
                                  ...lecture , chapter:chapterIndex +1
                                 };

                              });
                            }} className='text-blue-600 hover:underline font-semibold cursor-pointer'>Watch</p>} 
                            <p className='font-semibold'>
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2 py-3 mt-10'>
            <h2 className='text-xl font-bold'>Rate this course:</h2>
            <Rating initialRating={0}/>

          </div>

        </div>

        {/* left column  */}

        <div className='md:mt-10'>
          
          {player ?
          (<div>
            
            
            
            <YouTube videoId={player.lectureUrl.split('/').pop()} opts={{playerVars:{autoplay:1 }}} iframeClassName='w-full aspect-video' />
            <div  className='justify-between items-center flex  mt-1'>

          <p className='text-lg font-semibold p-3'>
            {/* {console.log(player)} */}
            {player.chapter}.{player.lectureOrder} {player.lectureTitle}
          </p>
          <button className='bg-blue-600'>Mark As Complete</button>
            </div>
          </div>
          )
          :
            <img src={data ? data.courseThumbnail : ""} alt="" />  
          }

        </div>
      </div>
      <Fotter />
    </>
  )
}

export default Player