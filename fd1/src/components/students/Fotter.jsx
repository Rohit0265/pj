import React from 'react'
import { assets } from '../../assets/assets/assets'

const Fotter = () => {
  return (
    <div className='mt-10 w-full bg-black  h-70'>
        <div className='flex flex-row justify-evenly pt-15 pr-30 pl-30'>
        <div className='w-70'>
            <div><img src={assets.logo_dark} alt="" width={100}/></div>
            <p className='text-gray-300/80 pt-4'>Lorem ipsum dolor sit amet consectetur apisicing elit.<br/> Voluptatibus nam, o harum blanditiptates accusantium quia?</p>
        </div>
        <div className='w-70 text-gray-200'>
            
            <h2 className='text-lg'>Company</h2>
            <ul className='pt-4 pl-3 text-sm'>
              <li className='pb-1'><a href="">Home</a></li>
              <li className='pb-1'><a  href="">About Us</a></li>
              <li className='pb-1'><a href="">Contact Us</a></li>
              <li className='pb-1'><a  href="">Privacy Policy</a></li>
            </ul>
        </div>
        <div className='w-70 hidden md:flex md:flex-col text-white'>
          <h2 className='font-semibold'>Subscribe to our newsletter</h2>
          <p className='pt-2 text-gray-200/90'>The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className='pt-3 gap-2 flex'>
          <input className='border w-45 pr-1 rounded-md pl-2' type="email" placeholder='Enter your mail'/>
          <button className='pl-5 pr-5 pt-2 pb-2 bg-blue-600 rounded-md cursor-pointer'>Subscribe</button>

          </div>
        </div>
        </div>

        <div className='border mt-8 mr-50 ml-50 mx-auto mb-3 border-white'></div>
        <p className='text-gray-200/80 text-center'>Copyright 2024 © GreatStack. All Right Reserved.</p>


    </div>
  )
}

export default Fotter