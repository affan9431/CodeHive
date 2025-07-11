import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ZoomMeets() {
  const [activeSession, setActiveSession] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const getCourses = async () => {
      // const res = await axios.get("http://localhost:8080/api/live-tutoring");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/live-tutoring`
      );
      setCourses(res.data.data);
    };
    getCourses();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinSession = async (URL, NAME, PRICE) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const session = await axios.post(
        // "http://localhost:8080/api/payment/create-charge-live",
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-charge-live`,
        { name: NAME, price: PRICE, URL: URL },
        { headers: { authorization: `Bearer ${token}` } }
      );
      window.location.replace(session.data.session.url);
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an issue processing your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold mb-6">Live Tutoring Sessions</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
        <ul className="space-y-4">
          {courses?.map((course, index) => {
            const todayLocalString = getLocalDateString(currentTime);
            const isToday = course.startDate === todayLocalString;
            let isSessionActive = false;

            if (isToday) {
              const startDateTime = new Date(
                `${todayLocalString}T${course.startTime}:00`
              );
              const endDateTime = new Date(
                `${todayLocalString}T${course.endTime}:00`
              );
              isSessionActive =
                currentTime >= startDateTime && currentTime <= endDateTime;
            }

            const isProcessingCurrent =
              isProcessing && activeSession === course.name;
            const isButtonDisabled = !isSessionActive || isProcessingCurrent;

            return (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{course.name}</span>
                  <span className="text-gray-600">
                    Instructor: {course.instructorID.userName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(
                      `${course.startDate}T${course.startTime}:00`
                    ).toLocaleString()}{" "}
                    -
                    {new Date(
                      `${course.startDate}T${course.endTime}:00`
                    ).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-4">
                    Charge: {course.price} {course.symbol}
                  </span>
                  <button
                    onClick={() => {
                      if (!isProcessing) {
                        setActiveSession(course.name);
                        handleJoinSession(
                          course.zoomId,
                          course.name,
                          course.price
                        );
                      }
                    }}
                    disabled={isButtonDisabled}
                    className={`py-2 px-4 rounded-md text-white font-semibold ${
                      isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : activeSession === course.name
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {isProcessingCurrent
                      ? "Processing..."
                      : isSessionActive
                      ? "Join Live Session"
                      : "Session Unavailable"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
