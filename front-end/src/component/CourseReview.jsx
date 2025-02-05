import React, { useEffect, useState } from "react";
import { useCourses } from "../hooks/useCourses";
import { getName } from "../utils/getName";
import axios from "axios";
import { Link } from "react-router-dom";

function CourseCard({ course }) {
  return (
    <div className="shadow-md  overflow-hidden bg-[#2D2F31] hover:bg-zinc-800 text-white">
      <div className="p-4">
        <Link
          to={`/instructor/course-review/review`}
          className="text-white hover:text-white"
        >
          <h2 className="text-lg font-semibold text-center">
            {course.courseTitle}
          </h2>
        </Link>
      </div>
    </div>
  );
}

function CourseGrid({ courses }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses?.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function CourseReview() {
  const { coursesData } = useCourses();
  const { decoded } = getName();

  const matchedData = coursesData?.filter(
    (course) => course.createdBy.email === decoded.email
  );

  return (
    <div className="mt-4 mx-4">
      {matchedData && matchedData.length > 0 ? (
        <CourseGrid courses={matchedData} />
      ) : (
        <div className="flex justify-center items-center flex-col mt-[17%]">
          <h1 className="text-3xl mb-2">
            No Course Found.Please Create a Course
          </h1>
          <Link to="/instructor/create-course">
            <button className="bg-zinc-800 hover:bg-[#2D2F31] text-white w-56 h-12">
              Create a new course
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CourseReview;
