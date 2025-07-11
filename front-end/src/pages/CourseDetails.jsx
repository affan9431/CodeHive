import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Clock, BarChart, Award, PlayCircle, X } from "lucide-react";
import { coursesData } from "./../data/dummyData"; // Import the dummy data
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { getName } from "../utils/getName";
import supabase from "../services/supabase";
import toast from "react-hot-toast";

const data = JSON.parse(localStorage.getItem("coursesData")) || coursesData;

const userName = localStorage.getItem("userName");

function Button({ children, variant, className, ...props }) {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
      : "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className, ...props }) {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
}

function ReviewModal({ isOpen, onClose, onSubmit }) {
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded?.id) {
        setUserId(decoded.id);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit({ message, rating });

    try {
      // Submit the review
      if (userId === "") {
        navigate("/login", { replace: true });
      }
      const res = await axios.post(
        // "http://localhost:8080/api/review/createReview",
        `${import.meta.env.VITE_BACKEND_URL}/api/review/createReview`,
        {
          id,
          userId,
          message,
          rating,
        }
      );

      // Close the modal and reload if submission is successful
      toast.success("Your review added successfully!");
      onClose();
      location.reload();
    } catch (error) {
      // Handle the error
      if (error.response && error.response.status === 400) {
        // If the error is due to a duplicate review submission
        setErrorMessage(
          "You have already submitted your review for this course."
        );
      } else {
        // Handle other errors as needed
        setErrorMessage("An error occurred while submitting your review.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Your Review</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  } hover:text-yellow-400`}
                >
                  <Star className="h-6 w-6" />
                  <span className="sr-only">{star} stars</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Review
            </label>
            <textarea
              id="comment"
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="w-full">
              Submit Review
            </Button>
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState("");
  const { decoded } = getName();
  const [content, setContent] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setIsLoading(true);
        if (course.length > 0 && course?.randomID) {
          let { data: Lectures, error } = await supabase
            .from("Lectures")
            .select("*")
            .eq("course_id", course?.randomID);
          if (data) {
            setContent(Lectures);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourseContent();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const { userName } = decoded;
      setUserName(userName);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    async function getReviews() {
      try {
        setIsLoading(true);
        const res = await axios.get(
          // "http://localhost:8080/api/review/getReviews"
          `${import.meta.env.VITE_BACKEND_URL}/api/review/getReviews`
        );

        const foundCourse = res.data.data.filter(
          (review) => review.courseID._id === id
        );

        if (foundCourse.length >= 1) {
          setCourse(foundCourse[0].courseID);
          setReviews(foundCourse);
          setIsLoading(false);
        } else {
          setIsLoading(true);
          // const res = await axios.get(`http://localhost:8080/api/course/${id}`);
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/course/${id}`
          );
          setCourse(res.data.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    getReviews();
  }, [id]);

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("token");

      const session = await axios.post(
        // "http://localhost:8080/api/payment/create-charge",
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-charge`,
        {
          name: course.courseTitle,
          price: Math.floor(course.price),
          id: id,
          purchasedBy: decoded.id,
          instructor: course.createdBy._id,
          course: course._id,
          status: "completed",
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.replace(session.data.session.url);
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an issue processing your payment. Please try again.");
    }
  };

  const handleAddReview = async () => {};

  const handleDeleteReview = async (id) => {
    await axios.delete(`http://localhost:8080/api/review/${id}`);
    // await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/review/${id}`);
    location.reload();
  };

  if (isloading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {course.courseTitle}
              </h2>
              <p className="text-xl text-gray-600 mb-4 truncate">
                {course.courseDescription}
              </p>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                  <Star className="h-5 w-5 text-gray-300" />
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {reviews.length !== 0
                    ? reviews.length + "ratings"
                    : "No ratings"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Created by {course.createdBy ? course.createdBy.userName : ""} •
                Last updated 3/2023
              </p>
              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  What you'll learn
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course?.intendedLearners?.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <PlayCircle className="h-5 w-5 mr-2 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Course content</h3>
                <ul className="space-y-2">
                  {content.length > 0 &&
                    content?.map((section) =>
                      section.sections.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                        >
                          <span className="font-medium">{item.title}</span>
                          <span className="text-sm text-gray-600">10:55</span>
                        </li>
                      ))
                    )}
                </ul>
              </Card>
              <div className="mt-4">
                <h1 className="text-2xl font-bold mb-3">Requirements</h1>
                <ul className="pl-6">
                  {course?.prerequisites?.map((item, index) => (
                    <li key={index} className="list-disc p-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h1 className="text-2xl font-bold mb-3">
                  Who this course is for:
                </h1>
                <ul className="pl-6">
                  {course?.courseFor?.map((item, index) => (
                    <li key={index} className="list-disc p-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">Student Reviews</h3>
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <>
                        <div className="flex items-center justify-between">
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
                                  <Star
                                    key={i}
                                    className="h-4 w-4 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600">{review.message}</p>
                          </div>
                          {review.userID.userName === userName && (
                            <div className="flex space-x-2 ml-2">
                              <FaRegEdit
                                className="text-blue-500 cursor-pointer"
                                title="Update"
                              />
                              <FaTrashAlt
                                className="text-red-500 cursor-pointer"
                                title="Delete"
                                onClick={() => handleDeleteReview(review._id)}
                              />
                            </div>
                          )}
                        </div>
                      </>
                    ))
                  ) : (
                    <p className="text-black">
                      No reviews available at this time.
                    </p>
                  )}
                  <Button
                    variant="outline"
                    className="w-full mt-6"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Add Your Review
                  </Button>
                </div>
              </Card>
            </div>
            <div className="md:w-1/3">
              <Card className="p-6">
                <img
                  src={`${course.imagePreview}`}
                  alt={course.courseTitle}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="text-3xl font-bold mb-4">{course.price}</div>
                <Button className="w-full mb-4">Add to cart</Button>
                <Button
                  variant="outline"
                  className="w-full mb-4"
                  onClick={handleBuyNow}
                >
                  Buy now
                </Button>
                <div className="text-sm text-gray-600 mb-4">
                  30-Day Money-Back Guarantee
                </div>
                <div className="space-y-2">
                  {[
                    { Icon: Clock, text: "10 hours on-demand video" },
                    { Icon: BarChart, text: "4 coding exercises" },
                    { Icon: Award, text: "Certificate of completion" },
                  ].map(({ Icon, text }, index) => (
                    <div key={index} className="flex items-center">
                      <Icon className="h-5 w-5 mr-2" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddReview}
      />
    </div>
  );
}
