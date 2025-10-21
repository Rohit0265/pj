import React from 'react'
import {assets, dummyTestimonial} from "../../assets/assets/assets"
import { Link, Navigate } from 'react-router-dom'
const Testomial = () => {
  return (
    <div>
        <div className='flex flex-col text-center mt-20'>
            <h2 className='font-bold text-2xl'>Testimonials</h2>
            <p className='text-gray-600/80 mt-5 font-medium'>Hear from our learners as they share their journeys of transformation, success, and how our
platform has made a difference in their lives.</p>
        </div>
        <div className='flex justify-center gap-7'>
            {dummyTestimonial.map((testomial,index)=>{
                return(

                <div className='border w-80 mt-20 rounded-md shadow-2xl  border-gray-500/80 items-center' key={index}>
                    <div className='flex justify-evenly   items-center w-80 bg-gray-500/10'>
                    <div className='pt-2 pb-2'>
                        <img width={60} src={testomial.image} alt={testomial.name} />
                    </div>
                    
                    <div>
                        <h1 className='font-bold'>{testomial.name}</h1>
                        <p className='text-gray-500/90'>{testomial.role}</p>

                    </div>
                    </div>

                    {/* //rating wala seen aur feedback wala seen yahapar hai ok  */}


                    <div className='m-7 '>

                <div className='flex'>
                    {[...Array(5)].map((_,i)=>(<img key={i} src={i<Math.floor((testomial.rating)) ? assets.star: assets.star_blank} className='w-5 h-5' alt='' />))}
                </div>
                    <div>
                        <h2 className='pt-6 pb-6'>{testomial.feedback}</h2>
                       <a href='#' className='underline text-blue-400 ' onClick={()=>scrollTo(0,0)}>Read More</a>
                    </div>
                    </div>
                </div>
                )
            })
            }

        </div>
    </div>
  )
}

export default Testomial