import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Fotter from '../../components/educator/Fotter'
function Educator() {
  return (
    <>
    <div className='text-default min-h-screen bg-shite'>
    <Navbar/>
    <div className='flex'>
      <Sidebar/>
      <div className='flex-1'>
    {<Outlet/>}
      </div>
    </div>
    <Fotter/>
    </div>
    </>
  )
}

export default Educator