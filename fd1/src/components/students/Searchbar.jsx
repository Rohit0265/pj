import React, { useState } from 'react'
import { assets } from '../../assets/assets/assets'
import { useNavigate } from 'react-router-dom'

const Searchbar = ({data}) => {

const navigate = useNavigate();
const [input,setInput] = useState(data ? data : "");

const Searchandler = (e)=>{
    e.preventDefault();
    navigate('/course-list/'+input)
}


  return (
        <form onSubmit={Searchandler} className='max-w-xl w-full mx-auto h-13 rounded-md bg-white border border-gray-700/30 flex mt-5 items-center'>
            <img src={assets.search_icon} alt=""  className='md:w-atuo w-10 px-2'/>
            <input onChange={e => {setInput(e.target.value)}} value={input} type="text" placeholder='Search for courses' className='w-full h-full outline-none text-gray-500/80'/>
            <button  type='submit' className='rounded bg-blue-500 text-white md:px-10 mx-1 py-2 px-8 '>Search</button>
        </form>

  )
}

export default Searchbar