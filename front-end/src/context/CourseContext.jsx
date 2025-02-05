import React, { createContext, useContext, useState } from "react";

const CourseDataContext = createContext();

export const CourseDataProvider = ({ children }) => {
  const [courseData, setCourseData] = useState({
    basic: "",
    "intended-learners": [],
    courseFor: [],
    prerequisites: [],
    curriculum: "",
    captions: "",
    "course-landing-page": "",
    pricing: "",
    // Add other fields as needed
  });

  const updateCourseData = (path, value) => {
    setCourseData((prevData) => ({ ...prevData, [path]: value }));
  };

  return (
    <CourseDataContext.Provider value={{ courseData, updateCourseData }}>
      {children}
    </CourseDataContext.Provider>
  );
};

export const useCourseData = () => useContext(CourseDataContext);
