import React from 'react'
import { assets } from '../../assets/assets/assets'

function Companies() {
  return (
    <div className='pt-16 w-full flex flex-col justify-center mx-auto'>
        <p className='mx-auto text-gray-500 text-[15px]'>Trusted by learners from</p>
        <div className='flex flex-wrap pt-10 justify-center gap-20'>
            <img src={assets.microsoft_logo} alt="Microsoft" />
            <img src={assets.walmart_logo} alt="Microsoft" />
            <img src={assets.accenture_logo} alt="Microsoft" />
            <img src={assets.adobe_logo} alt="Microsoft" />
            <img src={assets.paypal_logo} alt="Microsoft" />
        </div>
    </div>
  )
}

export default Companies