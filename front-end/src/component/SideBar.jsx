import React, { useState } from "react";
import { HiAcademicCap, HiInboxArrowDown } from "react-icons/hi2";
import { BsFillFileBarGraphFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdRateReview } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { RiLiveFill } from "react-icons/ri";

const SideBar = ({ setShowSidebar, showSidebar }) => {
  return (
    <div className="w-60 h-screen bg-slate-100 fixed flex flex-col items-center py-6 shadow-md">
      {/* Sidebar Header */}
      <h2 className="text-2xl font-bold text-slate-700 mb-10">Dashboard</h2>

      {/* Navigation Menu */}
      <ul className="w-full px-4 space-y-4">
        <Link
          to="/instructor/my-courses"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <li className="flex items-center gap-3 p-3 rounded-md text-lg text-slate-600 hover:bg-slate-300 hover:text-slate-800 transition duration-300 cursor-pointer">
            <HiAcademicCap className="text-slate-500 text-xl" />
            <span>My Courses</span>
          </li>
        </Link>
        <Link
          to="/instructor/create-course"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <li className="flex items-center gap-3 p-3 rounded-md text-lg text-slate-600 hover:bg-slate-300 hover:text-slate-800 transition duration-300 cursor-pointer">
            <HiInboxArrowDown className="text-slate-500 text-xl" />
            <span>Create New Courses</span>
          </li>
        </Link>
        <Link
          to="/instructor/performance"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <li className="flex items-center gap-3 p-3 rounded-md text-lg text-slate-600 hover:bg-slate-300 hover:text-slate-800 transition duration-300 cursor-pointer">
            <BsFillFileBarGraphFill className="text-slate-500 text-xl" />
            <span>Performance</span>
          </li>
        </Link>
        <Link
          to="/instructor/course-review"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <li className="flex items-center gap-3 p-3 rounded-md text-lg text-slate-600 hover:bg-slate-300 hover:text-slate-800 transition duration-300 cursor-pointer">
            <MdRateReview className="text-slate-500 text-xl" />
            <span>Course Reviews</span>
          </li>
        </Link>
        <Link
          to="/instructor/live-tuting"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <li className="flex items-center gap-3 p-3 rounded-md text-lg text-slate-600 hover:bg-slate-300 hover:text-slate-800 transition duration-300 cursor-pointer">
            <RiLiveFill className="text-slate-500 text-xl" />
            <span>Live Tutor</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default SideBar;
