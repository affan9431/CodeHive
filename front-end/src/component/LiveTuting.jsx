import React, { useState } from "react";
import { getName } from "../utils/getName";
import axios from "axios";

export default function LiveTutoring() {
  const [zoomId, setZoomId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [meetingName, setMeetingName] = useState("");
  const [price, setPrice] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { decoded } = getName();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");
      setSuccess(false);

      const zoomRegex =
        /^https:\/\/(?:us\d+web\.zoom\.us|zoom\.us)\/j\/\d{9,11}(?:\?pwd=[A-Za-z0-9\-_]+(?:\.[A-Za-z0-9\-_]+)?(?:&omn=\d+)?)?$/;

      if (!zoomRegex.test(zoomId)) {
        setError(
          "Invalid Zoom ID format. Please use a valid Zoom meeting URL."
        );
        return;
      }

      // Here you would typically send the data to your backend
      // const res = await axios.post("http://localhost:8080/api/live-tutoring", {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/live-tutoring`,
        {
          name: meetingName,
          price: price,
          zoomId: zoomId,
          symbol: currency,
          instructorID: decoded.id,
          startDate,
          startTime,
          endTime,
        }
      );

      setSuccess(true);
      setZoomId("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
              Add Live Tutoring Class
            </h1>
            <p className="mt-2 text-gray-500">
              Enter the Zoom meeting ID for your live tutoring class.
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label
                  htmlFor="meeting-name"
                  className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                >
                  Meeting Name
                </label>
                <input
                  type="text"
                  id="meeting-name"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  placeholder="Web development workshop"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <label
                  htmlFor="zoom-id"
                  className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                >
                  Zoom Meeting ID
                </label>
                <input
                  type="text"
                  id="zoom-id"
                  placeholder="https://zoom.us/j/123456789"
                  value={zoomId}
                  onChange={(e) => setZoomId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                >
                  Price
                </label>
                <div className="flex">
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mr-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                  <input
                    type="number"
                    id="price"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                {/* New Date and Time Fields */}
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <label
                  htmlFor="start-time"
                  className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <label
                  htmlFor="end-time"
                  className="block text-sm font-medium text-gray-700 mb-2 mt-2"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#27272A] text-white py-2 px-4 rounded-md hover:bg-[#27272B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Class
              </button>
            </form>
            {error && (
              <div
                className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {success && (
              <div
                className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">
                  Class successfully added!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
