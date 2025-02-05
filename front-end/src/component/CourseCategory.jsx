import React from "react";

function CourseCategory() {
  return (
    <>
      <div className="w-full h-[50vh] flex items-center justify-center mt-7">
        <div className="flex flex-col items-center w-full max-w-md bg-white p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
            What category best fits the knowledge you'll share?
          </h1>
          <p className="mb-4 text-gray-600 text-center text-sm md:text-base">
            If you're not sure about the right category, you can change it
            later.
          </p>
          <select className="border rounded-md p-2">
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Dropshipping">Dropshipping</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Business & Management">Business & Management</option>
            <option value="Language Learning">Language Learning</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default CourseCategory;
