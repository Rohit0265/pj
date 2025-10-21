import React from 'react'
import { assets } from '../../assets/assets/assets'

function hero() {
  return (
    <div className='pt-35 w-1/2 mx-auto relative'>
        <h1 className='text-4xl font-bold text-center'>Empower your future with the courses designed to <span className='text-red-500'>fit your choice.</span> </h1>
        <img className='absolute sm:hidden right-20 md:block ' src={assets.sketch} alt="" />
    <p  className='text-gray-500 w-2/3 md:block text-center mx-auto pt-5 max-w-2xl'>We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.</p>
    <p  className='text-gray-500 w-2/3 text-center mx-auto pt-5 md:hidden max-w-sm'>We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.</p>




    </div>
  )
}

export default hero