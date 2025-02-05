import React, { useEffect, useState } from "react";
import axios from "axios";
import { getName } from "../utils/getName";
import { Link } from "react-router-dom";

function AvailableCourse() {
  const [AllpurchasedCourse, setAllPurchasedCourse] = useState([]);
  const [purchasedCourse, setPurchasedCourse] = useState([]);
  const { decoded } = getName();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/purchase");
        setAllPurchasedCourse(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);


  useEffect(() => {
    const filteredCourses = AllpurchasedCourse.filter(
      (item) =>
        item.purchasedBy && item.purchasedBy.userName === decoded.userName
    );
    setPurchasedCourse(filteredCourses);
  }, [AllpurchasedCourse]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700">My Courses</h1>
        <p className="text-gray-600 mt-2">
          Start learning with your purchased courses
        </p>
      </div>
      <div className="container mx-auto">
        {purchasedCourse.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {purchasedCourse.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:transition-transform hover:transform hover:scale-105"
              >
                <img
                  src={item.course.imagePreview}
                  alt={item.course.courseTitle}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-bold text-gray-800 text-lg mb-2">
                    {item.course.courseTitle}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Created by: {item.instructor.userName}
                  </p>
                </div>
                <div className="p-4">
                  <Link
                    to={`/app/${item.course.courseTitle}/${item.course._id}/learn/lecture/success`}
                    className="block text-center bg-purple-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-600 transition-colors"
                  >
                    Start Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 text-lg">No purchased courses found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AvailableCourse;
