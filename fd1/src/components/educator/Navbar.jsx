import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets/assets'
import { UserButton,useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'


function Navbar() {
    const educator = dummyEducatorData
    const {user} = useUser()
  return (
    <div className='flex justify-between px-4 md:px-8 items-center border-b border-gray-500 py-3'>
        <Link to='/'>
        <img src={assets.logo} alt="" className='w-38 lg:32'/>
        </Link>
        <div className='flex gap-5 relative text-gray-500'>
            <p>HI{user ? user.fullName : "Developer"}</p>
            {user ? <UserButton/> : <img className='max-w-8' src={assets.user_icon}/>}
        </div>
        
    </div>
  )
}

export default Navbar