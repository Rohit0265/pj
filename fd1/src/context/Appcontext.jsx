import { createContext, useEffect,useState } from 'react';
import { dummyCourses } from '../assets/assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from "humanize-duration";
import {useAuth,useUser} from "@clerk/clerk-react"
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL
const [error,setError]= useState([])
    const currency = import.meta.env.VITE_CURRENCY;
const { isLoaded, isSignedIn} = useAuth();
    const navigate = useNavigate();

    const {getToken} = useAuth();
    const {user}=useUser();

    //fucntion rating find karne ke liye
const findRating = (course) => {
  // 🩵 Safety checks first
  if (!course || !Array.isArray(course.courseRatings) || course.courseRatings.length === 0) {
    return 0;
  }

  // 🧮 Calculate total rating safely
  const totalRating = course.courseRatings.reduce(
    (sum, rating) => sum + (rating?.rating || 0),
    0
  );

  // 🔢 Return average (rounded down)
  return Math.floor(totalRating / course.courseRatings.length);
};


    //time dduraartion for lectires finding

    const chapterduration = (chapter)=> {
        let time =0;
        chapter.chapterContent.map((lecture)=>{
            time += lecture.lectureDuration;
        })
        return humanizeDuration(time * 60 * 1000 ,{units : ["h" , "m"]} )
    }

    // calaculate course duration

    
    const courseduration = (course)=> {
        let time =0;
        course.courseContent.map((chapter)=>{
            chapter.chapterContent.map((lecture)=>[
                time += lecture.lectureDuration
            ])
        })
        return humanizeDuration(time * 60 * 1000 ,{units : ["h" , "m"]} )
    }

    // calculting total no. of lectures

    const totalnoLectures = (course)=>{
            let totalLectures = 0;
            course.courseContent.forEach(chapter => {
                if(Array.isArray(chapter.chapterContent)){
                    totalLectures += chapter.chapterContent.length;
                }
            })
            return totalLectures;
    }

    const [allCourse,setAllCourse] = useState([]);
    
    const [isEducator,seIsEducator] = useState(false);

    const [isEnrolled,setIsEnrolled] = useState([]);

    const [userData,setuserData] = useState(null)
    

    const enrollment = async ()=>{
        try {
            const token = await getToken();;
            const {data}= await axios.get(backendUrl+'/api/user/enrolled-courses',{headers:{Authorization:`Bearer ${token}`}})
    
            if(data.success){
                setIsEnrolled(data.enrolledCourses.reverse())
            }else{
                toast.error(data.messgae)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

// ✅ Corrected states
// const [userData, setuserData] = useState(null);
// const [isEducator, setIsEducator] = useState(false);
// const [isEnrolled, setIsEnrolled] = useState([]);

// ✅ Corrected function
// const fetchUserData = async () => {
const fetchUserData = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setError(res.data.message || "Failed to fetch user data");
        }
      } catch (err) {
        console.error("User fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch user data");
      }
    }


// ✅ useEffect to load user
useEffect(() => {
  console.log("🧠 isLoaded:", isLoaded);
  console.log("🔐 isSignedIn:", isSignedIn);
  if (isLoaded && isSignedIn) {
    console.log("✅ Fetching user data...");
    fetchUserData();
  } else {
    console.log("🚫 Not signed in — clearing user data");
    setuserData(null);
  }
}, [isLoaded, isSignedIn]);

useEffect(()=>{
    if(user){
      // console.log(user);
       console.log("🧑‍💻 userData in context:", userData);
       
console.log("📡 Fetching user data from:", `${backendUrl}/api/user/data`);
        // fetchUserData()
        enrollment()
    }

},[user]);

const fetchCourses = async () => {
  try {
    const url = `${backendUrl}/api/course/all`;
    console.log("📡 Fetching all courses from:", url);

    const response = await axios.get(url, { timeout: 10000 }); // 10s timeout
    const data = response?.data;

    console.log("✅ Backend response:", data);

    if (data && data.success) {
      const courses = data.course || data.courses || [];
      setAllCourse(courses);
      console.log(`🎯 Loaded ${courses.length} courses`);
    } else {
      const message = data?.message || "Failed to fetch courses";
      console.warn("⚠️ Course fetch failed:", message);
      toast.error(message);
    }
  } catch (error) {
    console.error("🚨 FetchCourses failed:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unexpected error while fetching courses";
    toast.error(message);
  }
};



    useEffect(()=>{
        fetchCourses()
    },[])


    const value = {
            currency,allCourse,navigate,findRating,isEducator,seIsEducator,totalnoLectures,courseduration,chapterduration,isEnrolled,enrollment,backendUrl,userData,setuserData,getToken,fetchCourses
    }
    return(

        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )


}

