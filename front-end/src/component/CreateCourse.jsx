import { useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getName } from "../utils/getName";
import { useCourseData } from "../context/CourseContext";

const CreateCourse = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { decoded } = getName();
  const navigate = useNavigate();
  const { courseData, updateCourseData } = useCourseData();

  const onSubmit = async (data) => {
    const tempId = uuidv4();

    const existingData = JSON.parse(localStorage.getItem("courses")) || [];

    const courseExists = existingData.some(
      (course) => course.title === data.title
    );

    if (courseExists) {
      const userConfirmed = window.confirm(
        "You have already created a course with this name. Do you want to create another course with the same name?"
      );

      if (!userConfirmed) {
        return;
      }
    }

    existingData.push({ id: tempId, title: data.title, createdBy: decoded.id });

    localStorage.setItem("courses", JSON.stringify(existingData));

    const redirectUrl = `/instructor/my-courses/manage/${data.title}/${tempId}/intended-learners`;

    setTimeout(() => {
      navigate(redirectUrl);
    }, 1200);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white p-4 rounded-sm  mt-36"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Create title for your Course
      </h2>

      <div className="mb-3">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="title"
        >
          <FaRegFileAlt className="text-gray-500 mr-2" />
          Title
        </label>
        <input
          type="text"
          id="title"
          {...register("title", { required: "Title is required" })}
          className="w-[100%] h-10 outline-none border-zinc-600 border-1 p-3 text-xs"
          placeholder="e.g. React Mastery: From Basics to Advanced"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-[#2D2F31] hover:bg-zinc-800 text-white font-semibold py-1 px-4 transition duration-200 w-[100%] h-10"
      >
        Continue to Details
      </button>
    </form>
  );
};

export default CreateCourse;
