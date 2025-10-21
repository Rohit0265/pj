import React from 'react'
import { assets } from '../../assets/assets/assets'

const CallToAction = () => {
  return (
    <div>
        <div className='text-center'>
            <h1 className='font-bold text-4xl pt-30'>Learn anything, anytime, anywhere</h1>
            <p className='text-gray-500 pt-4'>Lorem ipsum dolor sit amet. ipsum dolor sit amet consectetur adipisicing elit. Impedit, debitis.</p>
        </div>
        <div className='justify-center gap-6 flex mt-15'>
            <button className='bg-blue-600 cursor-pointer rounded-lg text-white pr-10 pl-10 pt-3 pb-3 text-lg'>Get Started</button>
            <div className='flex font-semibold items-center cursor-pointer gap-2'>Learn More <img className='w-6' src={assets.arrow_icon} alt="" /></div>
        </div>
    </div>
  )
}

export default CallToAction