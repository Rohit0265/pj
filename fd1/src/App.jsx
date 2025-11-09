import CourseList from "./pages/students/CourseList"
import CourseDetail from "./pages/students/CourseDetail"
import Enrollment from "./pages/students/Enrollment"
import Home from "./pages/students/home"
import "quill/dist/quill.snow.css";
  import { ToastContainer, toast } from 'react-toastify';
import { Route,Routes, useMatch } from 'react-router-dom'
import Loading from "./pages/students/Loading"
import Player from "./pages/students/Player"
import Dashboard from "./pages/educator/Dashboard"
import Educator from "./pages/educator/Educator"
import AddCourse from "./pages/educator/Add-Course"
import MyCourse from "./pages/educator/My-Course"
import Navbar from "./pages/students/Navbar"
import {ClerkProvider} from '@clerk/clerk-react'
import StudentEnrolled from "./pages/educator/StudentEnrolled"
const App = () => {






  const eductor = useMatch('/educator/*')



  return (
    <>
    <ToastContainer/>
    {!eductor && <Navbar/>}
    <Routes>
      {/* YE STUDENT KE LIYE  */}
      <Route path='/' element ={<Home/>}/>
      <Route path='/Course-List/' element ={<CourseList/>}/>
      <Route path='/Course-List/:id' element ={<CourseList/>}/>
      <Route path='/Course-Detail/' element ={<CourseDetail/>}/>
      <Route path='/Course-Detail/:id' element ={<CourseDetail/>}/>
      <Route path='/my-enrollment' element ={<Enrollment/>}/>
      <Route path='/Loading' element ={<Loading/>}/>
      <Route path='/Player/:CourseId' element ={<Player/>}/>
      <Route path='/Player' element ={<Player/>}/>

{/* EDUCTOR  KA  HAI YE SECTION */}

      <Route path="/educator" element={<Educator/>}>
      <Route path="dashboard" element={<Dashboard/>}/>
      <Route path="my-course" element={<MyCourse/>}/>
      <Route path="add-course" element={<AddCourse/>}/>
      <Route path="student-enrolled" element={<StudentEnrolled/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App