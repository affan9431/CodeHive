import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getName } from "../utils/getName";
import { useCourses } from "../hooks/useCourses";

function CourseCard({ course }) {
  return (
    <div className="shadow-md  overflow-hidden bg-[#2D2F31] hover:bg-zinc-800 text-white">
      <div className="p-4">
        <Link
          to={`/instructor/my-courses/manage/${
            course.courseTitle ? course.courseTitle : course.title
          }/${course.randomID ? course.randomID : course.id}`}
          className="text-white hover:text-white"
        >
          <h2 className="text-lg font-semibold text-center">
            {course.courseTitle ? course.courseTitle : course.title}
          </h2>
        </Link>
      </div>
    </div>
  );
}

function CourseGrid({ courses }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function MyCourses() {
  const [activeTab, setActiveTab] = useState("all");
  const [courses, setCourses] = useState([]);
  const { decoded } = getName();
  const { coursesData, error, isLoading } = useCourses();

  useEffect(() => {
    const courseData = JSON.parse(localStorage.getItem("courses")) || []; // Ensure courseData is always an array

    if (!coursesData) {
      setCourses(courseData);
      return;
    }

    const userCourses = coursesData.filter(
      (course) => course.createdBy?._id === decoded.id
    );

    setCourses(userCourses.length > 0 ? userCourses : courseData);
  }, [decoded.id, coursesData]);

  const filteredCourses = {
    all: courses,
    draft: courses?.filter((course) => course.status === "draft"),
    archived: courses?.filter((course) => course.status === "archived"),
  };

  if (!courses?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="mb-4 text-lg">No courses available.</p>
        <Link
          to="http://localhost:5173/instructor/create-course"
          className="px-4 py-2 text-white bg-[#2D2F31] transition"
        >
          Create a Course
        </Link>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Courses</h1>
      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          {["all", "draft", "archived"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              w
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Courses
            </button>
          ))}
        </div>
      </div>
      <CourseGrid courses={filteredCourses[activeTab]} />
      <Outlet />
    </div>
  );
}

export default MyCourses;
