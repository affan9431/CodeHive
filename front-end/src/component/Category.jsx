import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Carousel from "./Carousel";
import axios from "axios";
import { useCourses } from "../hooks/useCourses";
import Loader from "./Loader";

export default function Category() {
  // State to hold fetched courses
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { coursesData, error, isLoading } = useCourses();

  useEffect(() => {
    if (!isLoading && !error && coursesData) {
      setCourses(coursesData);
      setLoading(false);
    }
  }, [coursesData, error, isLoading]);

  // Render loading state if data is being fetched
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-[#B671FF] text-white mt-24">
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div>
          {coursesData.length > 0 && (
            <>
              <div>
                <h1 className="text-4xl ml-2 mb-6 font-bold font-mono">
                  Our Featured Courses
                </h1>
              </div>
              <div className="flex flex-col items-center sm:flex-row">
                <div className="grid grid-cols-1 w-80 md:w-auto sm:w-auto h-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {coursesData.map(
                    (course) =>
                      course.status !== "draft" && (
                        <div
                          key={course._id} // Assuming the API uses _id as the unique identifier
                          className="bg-white shadow-md rounded-lg overflow-hidden"
                        >
                          <img
                            src={`${
                              course.imagePreview ||
                              "./../../public/blockchain.jpeg"
                            }`} // Make sure the image URL from API is correct
                            alt={course.courseTitle}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-4">
                            <h2 className="font-bold text-gray-800 mb-2">
                              {course.courseTitle}
                            </h2>

                            <p className="">
                              Created by: {course.createdBy.userName}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-900 font-bold">
                                {course.symbol}
                                {course.price}
                              </span>
                              <Link
                                to={`/app/courseDetail/${course._id}`}
                                className="text-black font-semibold py-2 px-4 rounded-md"
                              >
                                View Course
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
