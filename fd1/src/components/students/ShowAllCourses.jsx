import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/Appcontext";
import CourseCard from "./CourseCard";

function ShowAllCourses() {
  const { allCourse } = useContext(AppContext);

  return (
    <div className="text-center pt-10">
      <h1 className="font-bold text-3xl text-gray-800">Learn from the best</h1>
      <p className="pt-4 pb-8 text-gray-600 max-w-2xl mx-auto">
        Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
      </p>

      <div className="grid custom-grid gap-5 ml-10 mb-10 mr-10">
        {Array.isArray(allCourse) && allCourse.length > 0 ? (
          allCourse.slice(0, 4).map((course, index) => (
            <CourseCard key={index} course={course} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full py-4">
            No courses available yet.
          </p>
        )}
      </div>

      <Link
        to="/course-list"
        onClick={() => window.scrollTo(0, 0)}
        className="inline-block border rounded-md text-gray-600 py-2 px-5 border-gray-400 hover:bg-gray-100 transition"
      >
        Show all courses
      </Link>
    </div>
  );
}

export default ShowAllCourses;
