import React from 'react'
import Hero from '../../components/students/hero'
import Searchbar from '../../components/students/Searchbar'
import Companies from '../../components/students/Companies'
import ShowAllCourses from '../../components/students/ShowAllCourses'
import Testomial from '../../components/students/Testomial'
import CallToAction from '../../components/students/CallToAction'
import Fotter from '../../components/students/Fotter'

function home() {
  return (
    <div className='justify-center flex-col flex'>

    <Hero/>
<Searchbar/>
<Companies/>
<ShowAllCourses/>
<Testomial/>
<CallToAction/>
<Fotter/>
    </div>
  )
}

export default home