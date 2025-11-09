// import React, { useState, useContext, useEffect, useRef } from "react";
// import { AppContext } from "../../context/Appcontext";
// import Loading from "../students/Loading";
// import uniqid from 'uniqid';
// import Quill from "quill";
// import { assets } from "../../assets/assets/assets";

// function AddCourse() {
//   const quillref = useRef(null);
//   const editorref = useRef(null);

//   const [courseTitle, setcourseTitle] = useState("");
//   const [coursePrice, setcoursePrice] = useState(0);
//   const [discount, setdiscount] = useState(0);
//   const [image, setimage] = useState(null);
//   const [chapters, setchapters] = useState([]);
//   const [showpopup, setshowpopup] = useState(false);
//   const [currentchapterid, setcurrentchapterid] = useState(null);

//   const [lecturedetails, setlecturedetails] = useState({
//     lectureTitle: "",
//     lectureDuration: "",
//     lectureUrl: "",
//     isPreviewwFree: false,
//   });

//   const handlechange = (action,chapterId) =>{
//     if(action === 'add'){
//       const title = prompt('Enter Chapter Name:');
//       if(title){
//         const newChapter = {
//           chapterId :uniqid(),
//           chapterTitle : title,
//           chapterContent :[],
//           collapsed:false,
//           chapterOrder: chapters.length > 0 ? chapters.shiftlice(-1)[0].chapterOrder + 1 : 1,
//         };
//         setchapters([...chapters,newChapter])
//       }
//     }else if(action === 'remove'){
//       setchapters(chapters.filter((chapter)=> chapter.chapterId !== chapterId));
//     }else if(action === 'toggle'){
//       setchapters(
//         chapters.map((chapter)=>(
//           chapter.chapterId === chapterId ? {...chapter,collapsed:!chapter.collapsed}: chapter
//         ))
      
//       )
//     }
//   }

//   const handlelecture = (action,chapterId,lectureIndex)=>{
//     if(action === 'add'){
//       setcurrentchapterid(chapterId);
//       setshowpopup(true);
//     }else if(action === 'remove'){
//       chapters.map((chapter)=>{
//         if(chapter.chapterId === chapterId){
//           chapter.chapterContent.splice(lectureIndex,1)
//         }
//         return chapter;
//       })
//     }
//   }

//   useEffect(() => {
//     if (!quillref.current && editorref.current) {
//       quillref.current = new Quill(editorref.current, {
//         theme: "snow",
//       });
//     }
//   }, []);

//   return (
//     <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
//       <form className="flex flex-col gap-4 max-w-md w-full text-gray-500">
//         <div className="flex flex-col gap-1">
//           <p>Course Title</p>
//           <input
//             onChange={(e) => setcourseTitle(e.target.value)}
//             type="text"
//             placeholder="Type here"
//             className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 "
//             required
//           />
//         </div>
//         <div className="flex flex-col gap-1">
//           <p>Course Description</p>
//           <div ref={editorref}></div>
//           <div className="flex items-center justify-between flex-wrap">
//             <div className="flex flex-col gap-1">
//               <p>Course Price</p>
//               <input
//                 onChange={(e) => setcoursePrice(e.target.value)}
//                 className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
//                 value={coursePrice}
//                 placeholder="0"
//                 required
//                 type="number"
//               />
//             </div>
//             <div className="flex md:flex-row flex-col items-center gap-3">
//               <p>Course Thumbnail</p>
//               <label
//                 htmlFor="thumbnailImage"
//                 className="flex items-center gap-3"
//               >
//                 <img
//                   src={assets.file_upload_icon}
//                   alt="upload"
//                   className="p-3 bg-blue-500 rounded"
//                 />
//                 <input
//                   type="file"
//                   id="thumbnailImage"
//                   onChange={(e) => setimage(e.target.files[0])}
//                   accept="image/*"
//                   hidden
//                 />
//                 <img src={image ? URL.createObjectURL(image) : " "} alt="" />
//               </label>
//             </div>
//           </div>
//           <div className="flex flex-col gap-1">
//             <p>Discount %</p>
//             <input
//               onChange={(e) => setdiscount(e.target.value)}
//               value={discount}
//               type="number"
//               placeholder="0"
//               max={100}
//               min={0}
//               className="md:py-2.5 outline py-2 w-28 px-3 rounded border-gray-500"
//             />
//           </div>
//           <div>
//             {chapters.map((chapter, chapterIndex) => (
//               <div
//                 key={chapterIndex}
//                 className="bg-white border rounded-lg mb-4"
//               >
//                 <div className="flex justify-between items-center p-4 border-b">
//                   <div className="flex items-center">
//                     <img OnClick={()=> handlelecture('toggle',chapter.chapterId)}
//                       src={assets.dropdown_icon}
//                       width={14}
//                       alt=""
//                       className={`mr-2 cursor-pointer transition-all  ${
//                         chapter.collapsed && "-rotate-90"
//                       }`}
//                     />
//                   </div>
//                   <span className="text-gray-500">
//                     {chapter.chapterContent.length} Lectures
//                   </span>
//                   <img OnClick={()=> handlechange('remove',chapter.chapterId)} src={assets.cross_icon} width={12} alt="" />
//                 </div>
//                 {!chapter.collapsed && (
//                   <div className="p-4">
//                     {chapter.chapterContent.map((lecture, lectureIndex) => (
//                       <div
//                         key={lectureIndex}
//                         className="flex justify-between items-center mb-2"
//                       >
//                         <span>
//                           {lectureIndex + 1}
//                           {lecture.lectureTitle}-{lecture.lectureDuration} mins
//                           -{" "}
//                           <a
//                             href={lecture.lectureUrl}
//                             target="_blank"
//                             className="text-blue-500"
//                           >
//                             Link
//                           </a>{" "}
//                           -{lecture.isPreviewwFree ? "Free Preview" : "Paid"}
//                         </span>
//                         <img onClick={()=> handlelecture('remove',chapter.chapterId,lectureIndex)} src={assets.cross_icon} width={12} alt="" />
//                       </div>
//                     ))}
//                     <div onClick={()=> handlelecture('add',chapter.chapterId)} className="inline =-flex bg-grayy-100 p-2 rounded cursor-pointer mt-2">
//                       + Add Lecture
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//             <div onClick={()=> handlechange('add')} className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer">+ Add Chapter</div>
//             {showpopup && (
//               <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//                 <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
//                 <h2 className="text-lg font-semibold mb-4 ">Add Lecture</h2>
//                 <div className="mb-2">
//               <p>Lecture Title</p>
//               <input type="text" className="mt-1 block w-full border rounded py-1 px-2"
//               value={lecturedetails.lectureTitle}
//               onChange={(e)=> setlecturedetails({...lecturedetails,lectureTitle:e.target.value})} />
//                 </div>
//               <div className="mb-2">
//                 <p>Duration(minutes)</p>
//                 <input type="number"
//                 className="mt-1 block w-full border rounded py-1 px-2"
//                 value={lecturedetails.lecture}
//                 onChange={(e)=> setlecturedetails({...lecturedetails,lectureDuration:e.target.value})} />
//               </div>

//                 <div className="mb-2">
//                   <p>Lecture URL</p>
//                   <input type="text" className="mt-1 block w-full border rounded py-1 px-2"
//                   value={lecturedetails.lectureUrl}
//                   onChange={(e)=> setlecturedetails({...lecturedetails,lectureUrl:e.target.value})} />
//                 </div>

//               <div className="flex gap-2 my-4">
//               <p>Is Preview Free?</p>
//               <input type="checkbox" className="mt-1 scale-125" checked={lecturedetails.isPreviewwFree}
//               onChange={(e)=> setlecturedetails({...lecturedetails,isPreviewwFree:e.target.checked})}/>
//               </div>
//               <button type="button" className="bg-blue-400 w-full text-white py-2 px-4 rounded">Add</button>
//               <img onClick={()=> setshowpopup(false)} src={assets.cross_icon} alt="" className="absolute top-4 right-4 w-4 cursor-pointer "/>

//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <button type="submit" className="bg-black text-white w-max py-2.5 px-8 rounded my-4">ADD</button>
//       </form>
//     </div>
//   );
// }
// export default AddCourse;




import React, { useState, useEffect, useRef, useContext } from "react";
import uniqid from 'uniqid';
import Quill from "quill";
import "quill/dist/quill.snow.css"; // IMPROVEMENT: Import Quill's CSS
import { assets } from "../../assets/assets/assets";
import { AppContext } from "../../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";

function AddCourse() {
  const {backendUrl,getToken} = useContext(AppContext)
  // Refs for the Quill editor
  const quillref = useRef(null);
  const editorref = useRef(null);

  // State for the form fields
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(""); // Use string for better input control
  const [discount, setDiscount] = useState(""); // Use string for better input control
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  
  // State for the lecture popup (modal)
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false, // FIX: Corrected typo isPreviewwFree -> isPreviewFree
  });

  // Initialize Quill editor
  useEffect(() => {
    if (!quillref.current && editorref.current) {
      quillref.current = new Quill(editorref.current, {
        theme: "snow",
        placeholder: "Write the course description here...",
      });
    }
  }, []);

  // --- Chapter Management ---
  const handleChapterChange = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          // FIX: Corrected typo 'shiftlice' to 'slice'
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  // --- Lecture Management ---
  const handleLectureAction = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      // FIX: Correctly update state immutably instead of mutating it.
      setChapters(chapters.map(chapter => {
        if (chapter.chapterId === chapterId) {
          // Create a new array for chapterContent without the removed lecture
          const updatedContent = chapter.chapterContent.filter((_, index) => index !== lectureIndex);
          return { ...chapter, chapterContent: updatedContent };
        }
        return chapter;
      }));
    }
  };

  // --- Form Submission Handlers ---
const handleAddLectureSubmit = () => {
  if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl) {
    alert("Please fill in all lecture fields.");
    return;
  }

  // Add the new lecture to the correct chapter immutably
  setChapters(chapters.map(chapter => {
    if (chapter.chapterId === currentChapterId) {
      const newLecture = {
        ...lectureDetails,
        lectureId: uniqid(),
        lectureOrder: chapter.chapterContent.length + 1, // ✅ Added lecture order
      };
      return { ...chapter, chapterContent: [...chapter.chapterContent, newLecture] };
    }
    return chapter;
  }));

  // Reset form and close popup
  setShowPopup(false);
  setCurrentChapterId(null);
  setLectureDetails({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });
};


 const handleCourseSubmit = async (e) => {
  e.preventDefault();

  try {
    const courseDescription = quillref.current.root.innerHTML;

    if (!image) {
      toast.error("Thumbnail Not Selected");
      return;
    }

    if (chapters.length === 0) {
      toast.error("Please add at least one chapter.");
      return;
    }

    const courseData = {
      courseTitle,
      courseDescription,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      courseContent: chapters,
    };

    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    formData.append("image", image);

    const token = await getToken();

    const { data } = await axios.post(`${backendUrl}/api/educator/add-course`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
console.log("Backend URL:", backendUrl);
console.log("Final Endpoint:", `${backendUrl}/api/educator/add-course`);

    if (data.success) {
      toast.success(data.message);
      setCourseTitle("");
      setCoursePrice("");
      setDiscount("");
      setImage(null);
      setChapters([]);
      if (quillref.current) quillref.current.root.innerHTML = "";
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  return (
    <div className="h-screen overflow-y-auto flex flex-col items-start md:p-8 p-4">
      {/* FIX: Added onSubmit handler to the form */}
      <form onSubmit={handleCourseSubmit} className="flex flex-col gap-4 max-w-2xl w-full text-gray-700">
        <h1 className="text-2xl font-bold text-gray-800">Add New Course</h1>
        
        {/* Course Title */}
        <div className="flex flex-col gap-1">
          <label>Course Title</label>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="e.g., Introduction to React"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-400 focus:border-blue-500"
            required
          />
        </div>
        
        {/* Course Description */}
        <div className="flex flex-col gap-1">
          <label>Course Description</label>
          <div ref={editorref} style={{ minHeight: '150px' }}></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Course Price */}
            <div className="flex flex-col gap-1">
              <label>Course Price ($)</label>
              <input
                onChange={(e) => setCoursePrice(e.target.value)}
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-400 focus:border-blue-500"
                value={coursePrice}
                placeholder="e.g., 99.99"
                required
                type="number"
                step="0.01"
              />
            </div>
            {/* Discount */}
            <div className="flex flex-col gap-1">
              <label>Discount (%)</label>
              <input
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                type="number"
                placeholder="e.g., 10"
                max={100}
                min={0}
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-400 focus:border-blue-500"
              />
            </div>
        </div>
        
        {/* Course Thumbnail */}
        <div className="flex flex-col gap-2">
            <label>Course Thumbnail</label>
            <div className="flex items-center gap-4">
                <label htmlFor="thumbnailImage" className="flex items-center gap-3 cursor-pointer p-3 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm">
                    <img src={assets.file_upload_icon} alt="upload" className="w-6"/>
                    <span>Choose Image</span>
                </label>
                <input
                    type="file"
                    id="thumbnailImage"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                    hidden
                />
                {/* IMPROVEMENT: Conditionally render image preview */}
                {image && <img src={URL.createObjectURL(image)} alt="Thumbnail Preview" className="w-24 h-24 object-cover rounded border" />}
            </div>
        </div>

        {/* Chapters Section */}
        <div className="flex flex-col gap-2 mt-4">
            <h2 className="text-xl font-semibold text-gray-800">Chapters & Lectures</h2>
          {chapters.map((chapter) => (
            <div key={chapter.chapterId} className="bg-gray-50 border rounded-lg mb-2">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-3">
                  <img
                    // FIX: Changed 'OnClick' to 'onClick'
                    onClick={() => handleChapterChange('toggle', chapter.chapterId)}
                    src={assets.dropdown_icon}
                    width={14}
                    alt="toggle"
                    className={`cursor-pointer transition-transform duration-300 ${chapter.collapsed && "-rotate-90"}`}
                  />
                  <span className="font-semibold">{chapter.chapterTitle}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm">
                        {chapter.chapterContent.length} Lectures
                    </span>
                    <img 
                        // FIX: Changed 'OnClick' to 'onClick'
                        onClick={() => handleChapterChange('remove', chapter.chapterId)} 
                        src={assets.cross_icon} width={12} alt="remove chapter" className="cursor-pointer"
                    />
                </div>
              </div>
              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div
                      // IMPROVEMENT: Use unique lectureId for key
                      key={lecture.lectureId}
                      className="flex justify-between items-center mb-2 p-2 bg-white rounded"
                    >
                      <span className="text-sm">
                        {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -{' '}
                        <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Link</a>
                        {' '}- {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                      </span>
                      <img onClick={() => handleLectureAction('remove', chapter.chapterId, lectureIndex)} src={assets.cross_icon} width={12} alt="remove lecture" className="cursor-pointer"/>
                    </div>
                  ))}
                  <div onClick={() => handleLectureAction('add', chapter.chapterId)} 
                    // FIX: Corrected CSS class typo
                    className="inline-flex bg-gray-100 hover:bg-gray-200 text-sm p-2 rounded cursor-pointer mt-2"
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}
          <div onClick={() => handleChapterChange('add')} className="flex justify-center items-center bg-blue-100 hover:bg-blue-200 p-2 rounded-lg cursor-pointer text-blue-800 font-medium">
            + Add Chapter
          </div>

          {/* Add Lecture Popup (Modal) */}
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white text-gray-700 p-6 rounded-lg shadow-xl relative w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
                <div className="mb-3">
                  <label>Lecture Title</label>
                  <input type="text" className="mt-1 block w-full border rounded py-1.5 px-2" value={lectureDetails.lectureTitle} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}/>
                </div>
                <div className="mb-3">
                  <label>Duration (minutes)</label>
                  {/* FIX: Value was pointing to a non-existent state property */}
                  <input type="number" className="mt-1 block w-full border rounded py-1.5 px-2" value={lectureDetails.lectureDuration} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}/>
                </div>
                <div className="mb-3">
                  <label>Lecture URL</label>
                  <input type="text" className="mt-1 block w-full border rounded py-1.5 px-2" value={lectureDetails.lectureUrl} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}/>
                </div>
                <div className="flex items-center gap-2 my-4">
                  <input type="checkbox" id="isFreePreview" className="h-4 w-4" checked={lectureDetails.isPreviewFree} onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}/>
                  <label htmlFor="isFreePreview">Is Preview Free?</label>
                </div>
                {/* FIX: Added onClick handler to the button */}
                <button type="button" onClick={handleAddLectureSubmit} className="bg-blue-500 w-full text-white py-2 px-4 rounded hover:bg-blue-600">Add</button>
                <img onClick={() => setShowPopup(false)} src={assets.cross_icon} alt="close" className="absolute top-4 right-4 w-4 cursor-pointer"/>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="bg-black text-white w-max py-2.5 px-8 rounded my-4 hover:bg-gray-800">ADD COURSE</button>
      </form>
    </div>
  );
}

export default AddCourse;