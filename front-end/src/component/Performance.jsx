import React, { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiBook,
  FiUsers,
  FiStar,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getName } from "../utils/getName";
import { useCourses } from "../hooks/useCourses";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import supabase from "../services/supabase";
import Loader from "./Loader";

// Initialize Supabase client

const colorClasses = [
  "bg-purple-100 text-purple-600 hover:bg-purple-200",
  "bg-blue-100 text-blue-600 hover:bg-blue-200",
  "bg-green-100 text-green-600 hover:bg-green-200",
  "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
  "bg-pink-100 text-pink-600 hover:bg-pink-200",
  "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
];

const KpiCard = ({ icon, title, value, colorClass }) => (
  <div
    className={`rounded-lg p-6 transition-all duration-300 ease-in-out ${colorClass}`}
  >
    <div className="flex items-center">
      <div className="bg-white bg-opacity-50 rounded-full p-3 mr-4">
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const Performance = () => {
  const { decoded } = getName();
  const { coursesData } = useCourses();
  const [course, setCourse] = useState({});
  const [reviews, setReviews] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const matchedData = coursesData?.filter(
    (course) => course.createdBy.userName === decoded.userName
  );

  const [allPurchasedCourse, setAllPurchasedCourse] = useState([]);
  const [purchasedCourse, setPurchasedCourse] = useState([]);

  const revenueData = purchasedCourse.map((course) => {
    const month = new Date(course.createdAt).toLocaleString("default", {
      month: "long",
    });
    return {
      month,
      revenue: course.course.price,
    };
  });

  // Fetch lectures from Supabase
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const { data, error } = await supabase
          .from("Lectures")
          .select("*")
          .eq("course_id", purchasedCourse[0]?.course?.randomID);

        if (error) throw error;
        setLectures(data || []);
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchLectures();
  }, []);

  // Existing purchase data fetch
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        // const res = await axios.get("http://localhost:8080/api/purchase");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/purchase`
        );
        setAllPurchasedCourse(res.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  // Filter purchased courses
  useEffect(() => {
    const filteredCourses = allPurchasedCourse.filter(
      (item) => item.instructor && item.instructor.email === decoded.email
    );
    setPurchasedCourse(filteredCourses);
  }, [allPurchasedCourse, decoded.email]);

  // Fetch reviews
  useEffect(() => {
    async function getReviews() {
      try {
        setIsLoading(true);
        const res = await axios.get(
          // "http://localhost:8080/api/review/getReviews"
          `${import.meta.env.VITE_BACKEND_URL}/api/review/getReviews`
        );

        const foundCourse = res?.data?.data?.find((review) =>
          matchedData?.some((course) => course._id === review.courseID._id)
        );
        if (foundCourse) {
          setCourse(foundCourse.courseID);
          setReviews(res.data.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    getReviews();
  }, []);

  // Calculate average course duration
  const avgCourseDuration =
    lectures.length > 0
      ? (
          lectures.reduce((acc, lecture) => acc + (lecture.duration || 0), 0) /
          lectures.length
        ).toFixed(1)
      : "0";

  // Calculate completion rate (assuming completion is tracked in lectures)
  const completionRate =
    lectures.length > 0
      ? (
          (lectures.filter((lecture) => lecture.completed).length /
            lectures.length) *
          100
        ).toFixed(0)
      : "0";

  // Fix for NaN ratings
  const validReviews = reviews.filter(
    (review) => review.rating && !isNaN(review.rating)
  );
  const avgRating =
    validReviews.length > 0
      ? (
          validReviews.reduce((acc, review) => acc + review.rating, 0) /
          validReviews.length
        ).toFixed(1)
      : "N/A";

  const totalRevenue = purchasedCourse.reduce(
    (acc, c) => acc + Number(c.course.price),
    0
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow rounded-lg p-6 mb-8 transition-all duration-300 ease-in-out hover:shadow-lg">
          <div className="flex items-center">
            <img
              src="/default.jpg"
              alt="Instructor"
              className="w-24 h-24 rounded-full mr-6 border-4 border-purple-200"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {decoded.userName}
              </h1>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KpiCard
            icon={<FiDollarSign />}
            title="Total Revenue"
            value={totalRevenue}
            colorClass={colorClasses[0]}
          />
          <KpiCard
            icon={<FiBook />}
            title="Courses Uploaded"
            value={matchedData?.length}
            colorClass={colorClasses[1]}
          />
          <KpiCard
            icon={<FiUsers />}
            title="Total Students"
            value={purchasedCourse.length}
            colorClass={colorClasses[2]}
          />
          <KpiCard
            icon={<FiStar />}
            title="Average Rating"
            value={avgRating}
            colorClass={colorClasses[3]}
          />
          <KpiCard
            icon={<FiTrendingUp />}
            title="Completion Rate"
            value={`${completionRate}%`}
            colorClass={colorClasses[4]}
          />
          <KpiCard
            icon={<FiClock />}
            title="Avg. Course Duration"
            value={`${avgCourseDuration} hours`}
            colorClass={colorClasses[5]}
          />
        </div>

        {revenueData.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-8 transition-all duration-300 ease-in-out hover:shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Revenue Over Time
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;
