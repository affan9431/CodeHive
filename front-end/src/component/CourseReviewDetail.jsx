import React, { useEffect, useMemo, useState } from "react";
import { useCourses } from "../hooks/useCourses";
import { getName } from "../utils/getName";
import axios from "axios";
import { Star } from "lucide-react";

function CourseReviewDetail() {
  const [reviews, setReviews] = useState([]);

  const { coursesData } = useCourses();
  const { decoded } = getName();

  const matchedData = useMemo(
    () =>
      coursesData?.filter((course) => course.createdBy.email === decoded.email),
    [coursesData, decoded.email]
  );

  useEffect(() => {
    async function getReviews() {
      try {
        const res = await axios.get(
          // "http://localhost:8080/api/review/getReviews"
          `${import.meta.env.VITE_BACKEND_URL}/api/review/getReviews`
        );

        const foundCourse = res.data.data.filter((review) =>
          matchedData?.some((course) => course._id === review.courseID._id)
        );

        // If foundCourse exists, set it to reviews state
        if (foundCourse) {
          setReviews(foundCourse);
        } else {
          console.log("No matching reviews found.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    getReviews();
  }, [matchedData]);

  return (
    <div className="m-3">
      <h1 className="mb-4 text-3xl font-bold">All Reviews</h1>
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <>
              <div className="flex items-center justify-between border-2 shadow-sm rounded-md">
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex items-center mb-2">
                    <img
                      src="/default.jpg"
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="font-medium mr-2">
                      {review.userID.userName}
                    </div>

                    <div className="flex">
                      {[...Array(review.rating || 4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.message}</p>
                </div>
              </div>
            </>
          ))
        ) : (
          <div>No reviews found</div>
        )}
      </div>
    </div>
  );
}

export default CourseReviewDetail;
