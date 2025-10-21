import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/Appcontext';
import { assets } from '../../assets/assets/assets';
import Footer from '../../components/students/Fotter';
import Youtube from 'react-youtube'
import humanizeDuration from 'humanize-duration';
import Loading from '../../components/students/Loading'

function CourseDetail() {
  const { id } = useParams();
  const [coursedata, setcoursedata] = useState(null);
  const [player, setPlayer] = useState(null);
  const [arrow, setarrow] = useState({});
  const { allCourse, findRating, totalnoLectures, courseduration, chapterduration, currency } = useContext(AppContext);

  const fetchdata = async () => {
    const findCourse = await allCourse.find(course => course._id === id);
    setcoursedata(findCourse);
  };

  const updowm = (index) => {
    setarrow((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    fetchdata();
  }, [allCourse]);

  return coursedata ? (
    <div>
      <div className='mt-15 pl-25'>
        {/* Removed redundant and syntactically incorrect check for 'coursedata' */}
        <div className='flex gap-12 justify-between'>
          <div className='w-1/2'>
            {/* left part */}
            <h2 className='font-semibold text-4xl'>{coursedata.courseTitle}</h2>
            <p className='text-gray-500 pt-5' dangerouslySetInnerHTML={{ __html: coursedata.courseDescription.slice(0, 200) }}></p>
            {/* reviews and rating */}
            <div className='flex gap-2 pt-5 mx-auto items-center'>
              <p>{findRating(coursedata)}</p>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={i < Math.floor(findRating(coursedata)) ? assets.star : assets.star_blank} className='w-3.5 h-3.5' alt='' />
                ))}
              </div>
              <p className='text-blue-500'>({coursedata.courseRatings.length} {coursedata.courseRatings.length > 1 ? "ratings)" : "rating)"}</p>
              <p className='text-gray-500'>
                {coursedata.enrolledStudents.length} {coursedata.enrolledStudents.length > 1 ? "Students" : "Student"}
              </p>
            </div>
            <p className='mt-3'>Course By <span className='text-blue-600 underline'>Rohit Mathur</span></p>
            <div>
              <h2 className='text-2xl mb-4 font-semibold pt-4'>Course Structure</h2>
            </div>
            <div>
              {coursedata.courseContent.map((chapter, index) => (
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
                      {chapter.chapterContent.map((lecture, index) => (
                        <li className='text-gray-800 pb-2 pt-3 text-xs md:text-default' key={index}>
                          <div className='flex justify-between items-center'>
                            <div className='flex gap-2'>
                              <img src={assets.play_icon} alt="" />
                              <p className='cursor-pointer text-sm hover:underline'>{lecture.lectureTitle}</p>
                            </div>
                            <div className='flex gap-2'>
                              {lecture.isPreviewFree && <p onClick={()=>{
                               
                              setPlayer(()=>{
                               return { videoId : lecture.lectureUrl.split("/").pop()};
                                
                              });
                            }} className='text-blue-600 hover:underline font-semibold cursor-pointer'>Preview</p>} {/* Corrected typo: Previw -> Preview */}
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
            <div>
              <h1 className='font-semibold text-xl pt-7'>Course Description</h1>
              <p className='pt-5 rich-text' dangerouslySetInnerHTML={{ __html: coursedata.courseDescription }}></p>
            </div>
          </div>
          {/* right part begins */}
          <div className='w-120 shadow-2xl max-h-fit mr-25 pt-5 overflow-hidden ml-23'>

            {
              player ? 
              <Youtube videoId={player.videoId} opts={{playerVars:{autoplay:1 }}} iframeClassName='w-full aspect-video' />
              :
            <img src={coursedata.courseThumbnail} alt={coursedata.courseTitle} />
            }
            <div className='flex gap-2 p-4'>
              <img src={assets.time_left_clock_icon} alt="" />
              <p className='text-red-500 text-md'><span className='font-semibold'>5 days</span> left at this price</p>
            </div>
            <div className='flex gap-4 items-center pl-4'>
              <p className='font-bold text-3xl'>{currency} {(coursedata.coursePrice - coursedata.discount * coursedata.coursePrice / 100).toFixed(2)}</p>
              <p className='line-through text-xl text-gray-500'>{currency}{coursedata.coursePrice}</p>
              <p className='text-gray-600 text-xl'>{coursedata.discount}% off</p>
            </div>
            <div className='p-4 flex gap-5 items-center'>
              <div className='flex gap-1'>
                <img src={assets.star} alt="" />
                <p>{findRating(coursedata)}</p>
              </div>
              <div className='h-5 w-px bg-gray-500/40'></div>
              <div className='flex gap-2'>
                <img src={assets.time_clock_icon} alt="" />
                <p>{courseduration(coursedata)}</p>
              </div>
              <div className='h-5 w-px bg-gray-500/40'></div>
              <div className='flex gap-2'>
                <img src={assets.lesson_icon} alt="" />
                <p>{totalnoLectures(coursedata)} Lessons</p>
              </div>
            </div>
            <div className='justify-center flex'>
              <button className='bg-blue-500 text-white w-full font-semibold text-md px-15 py-2 mt-3 mx-8 rounded cursor-pointer'>Enroll Now</button>
            </div>
            <div className='rich-text ml-10'>
              <h2>What's in this course?</h2>
              <ul>
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loading/>
  );
}

export default CourseDetail;