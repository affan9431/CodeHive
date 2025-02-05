import { useState } from "react";
import CourseCreationHeader from "./../component/CourseCreationHeader";
import SideBar from "../component/SideBar";
import { Outlet } from "react-router-dom";

function CourseCreation() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
      <div className="">
        <CourseCreationHeader
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
        />
        {showSidebar && <SideBar />}
        {/* <CreateCourse /> */}
      </div>
      <Outlet />
    </>
  );
}

export default CourseCreation;
