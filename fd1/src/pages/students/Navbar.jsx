import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import {assets } from '../../assets/assets/assets'
import {useClerk ,UserButton ,useUser } from "@clerk/clerk-react"
import { AppContext } from '../../context/Appcontext';

function Navbar() {

  const {openSignIn} = useClerk();
  const {user} = useUser();
  const {navigate,isEducator,backendUrl,setIsEducator,getToken} = useContext(AppContext);
  const Navc = location.pathname.includes("/educator")

  // const {}  = useContext(AppContext)  
  const becomeEducator = async ()=>{
    try {
      if(isEducator){
        navigate('/educator')
        return;
      }
      const token = await getToken()
      const {data} = await axios.get(backendUrl + 'api/educator/update-role',{headers:{Authorization : `Bearer ${token}` }})


      if(data.success){
        setIsEducator(true)
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(data.message)
      
    }
  }
  return (

    <>
    
    <div className={`flex pt-2 pb-2 items-center border-2 justify-around ${Navc ? "bg-white" : "bg-cyan-200"}` }>
        <div><img onClick={()=>{navigate("/")}} width={150} src={assets.logo} alt="" /></div>
        <div className='hidden md:flex items-center gap-20'>
            <div className='gap-5 flex font-bold'> 
                { user && <>
                <button className='cursor-pointer' onClick={becomeEducator}>{isEducator ? "Educator Dashboard":"Become Educator"}</button>
                |<Link to={'/my-enrollment'}>My Enrollment</Link>
                </>
                }
            </div>
              <div>
                { user ? <UserButton/> :
                <button onClick={()=>{
                  openSignIn();
                }} className='bg-blue-600  text-white rounded-2xl p-2'>Create Account</button>
              }
            </div>
        </div>
        <div className='md:hidden items-center flex gap-10'>
                <div className='gap-5 flex font-bold'> 
                  {user  && <>
                    <button onClick={isEducator}>{isEducator ? 'Educator Dashboard': 'Become Educator'}</button>
                    |<Link to={'/my-enrollment'}>My Enrollment</Link>
                  </>
                  }
            </div>
            <div>
              {user ? <UserButton/> : <img src={assets.user_icon} width={30} alt="" />}
              </div>
        </div>
    </div>
    </>
  )
}

export default Navbar