import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getName } from "../utils/getName"; // Import the function to get user ID
import supabase from "../services/supabase";

const titles = ["Course subtitle", "Course description"];
const allLanguages = [
  "English (US)",
  "Arabic",
  "Afrikaans",
  "Albanian",
  "Armenian",
  "Aymara",
  "Azeri",
  "Basque",
  "Bengali",
  "Bosnian",
  "Bulgarian",
  "Burmese",
  "Catalan",
  "Cherokee",
  "Croatian",
];
const allLevel = [
  "--Select Level--",
  "Beginner Level",
  "Intermediate Level",
  "Advanced Level",
];
const allCategory = [
  "--Select Category--",
  "Development",
  "IT & Software",
  "Business",
  "Marketing",
  "Design",
  "Finance & Accounting",
  "Personal Development",
  "Health & Fitness",
  "Photography & Video",
  "Music",
  "Teaching & Academics",
  "Language Learning",
  "Project Management",
  "Human Resources",
  "Sales",
  "Office Productivity",
  "Data Science",
  "Cybersecurity",
  "Networking",
  "Digital Marketing",
  "Graphic Design",
  "Writing & Content Creation",
  "Art & Creativity",
  "Cooking & Nutrition",
  "Lifestyle",
  "Real Estate",
  "Law & Ethics",
  "Social Sciences",
  "Engineering",
  "Mathematics",
];

function CourseLanding() {
  const { title, id } = useParams();

  const { decoded } = getName();
  const userId = decoded?.id;

  const [formData, setFormData] = useState({
    courseTitle: title || "",
    courseSubtitle: "",
    courseDescription: "",
    languageName: "English (US)",
    levelName: "--Select Level--",
    categoryName: "--Select Category--",
    imagePreview: "/coursePhoto.jpg",
    promotionalVideo: null,
  });

  const [fileObj, setFileObj] = useState({});

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("courseData"));

    const matchData =
      savedData &&
      savedData.find((item) => item.userId === userId && item.id === id);
    matchData &&
      setFormData({
        courseTitle: matchData.courseTitle,
        courseSubtitle: matchData.courseSubtitle,
        courseDescription: matchData.courseDescription,
        languageName: matchData.languageName,
        levelName: matchData.levelName,
        categoryName: matchData.categoryName,
        imagePreview: matchData.imagePreview,
        promotionalVideo: null,
      });
  }, [id, userId]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      let imageUrl = null;

      if (fileObj) {
        const fileName = `${Date.now()}-${fileObj.name}`;

        // Upload the image to Supabase
        const { data, error } = await supabase.storage
          .from("course-image")
          .upload(fileName, fileObj, {
            contentType: fileObj.type, // Ensure correct content type
          });

        if (error) {
          console.error("Error uploading image:", error);
          alert(`Failed to upload the image: ${fileObj.name}`);
          return;
        }

        const { data: publicURLData, error: urlError } = supabase.storage
          .from("course-image")
          .getPublicUrl(fileName);

        if (urlError) {
          console.error("Error getting public URL:", urlError);
          alert(`Failed to get public URL for: ${fileObj.name}`);
          return;
        }

        imageUrl = publicURLData.publicUrl;
        formData.imagePreview = imageUrl;

        saveToLocalStorage();
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const saveToLocalStorage = () => {
    const courseDataToSave = { ...formData, userId, id };

    const courseData = JSON.parse(localStorage.getItem("courseData")) || [];

    const existingDataIndex = courseData.findIndex(
      (item) => item.userId === userId && item.id === id
    );

    if (existingDataIndex !== -1) {
      courseData[existingDataIndex] = courseDataToSave;
    } else {
      courseData.push(courseDataToSave);
    }

    localStorage.setItem("courseData", JSON.stringify(courseData));
    alert("Course data saved!");
  };
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        formData.courseTitle ||
        formData.courseSubtitle ||
        formData.courseDescription ||
        formData.languageName !== "English (US)" ||
        formData.levelName !== "--Select Level--" ||
        formData.categoryName !== "--Select Category--"
      ) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formData]);

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex flex-col sm:flex-row items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold my-2">
          Course landing page
        </h1>
        {/* <button className="bg-[#2D2F31] hover:bg-[#2D2F32] text-white font-semibold py-2 px-4 transition duration-200 w-full sm:w-auto">
          Preview
        </button> */}
      </div>
      <div className="w-full h-[1px] bg-slate-300"></div>
      <div className="my-2">
        <p>
          Your course landing page is crucial to your success on CodeHive...
        </p>

        <div className="mt-4">
          <h1 className="text-[15px] font-bold">Course title</h1>
          <input
            type="text"
            value={formData.courseTitle}
            className="w-full sm:w-[70%] h-10 outline-none border-zinc-600 border p-3 text-[16px] mt-2"
            placeholder="Insert your course title."
            onChange={(e) => handleChange("courseTitle", e.target.value)}
          />
        </div>

        <InputTitle
          title="Course subtitle"
          value={formData.courseSubtitle}
          placeholder="Insert your course subtitle."
          onChange={(value) => handleChange("courseSubtitle", value)}
        />
        <InputTitle
          title="Course description"
          value={formData.courseDescription}
          placeholder="Insert your course description."
          onChange={(value) => handleChange("courseDescription", value)}
        />

        <div className="mt-4">
          <h1 className="text-[15px] font-bold">Basic info</h1>
          <div className="flex flex-wrap gap-3 sm:gap-5">
            <DropDownButton
              data={allLanguages}
              name={formData.languageName}
              setName={(value) => handleChange("languageName", value)}
            />
            <DropDownButton
              data={allLevel}
              name={formData.levelName}
              setName={(value) => handleChange("levelName", value)}
            />
            <DropDownButton
              data={allCategory}
              name={formData.categoryName}
              setName={(value) => handleChange("categoryName", value)}
            />
          </div>
        </div>

        <ImageLoader
          imagePreview={formData.imagePreview}
          onChange={(value) => handleChange("imagePreview", value)}
        />

        <div className="mt-4">
          <button
            onClick={handleSave}
            className="bg-[#2D2F31] hover:bg-[#2D2F32] text-white font-semibold py-2 px-4 transition duration-200 w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  function InputTitle({ title, value, placeholder, onChange }) {
    return (
      <div className="mt-4">
        <h1 className="text-[15px] font-bold">{title}</h1>
        <input
          type="text"
          value={value}
          className="w-full sm:w-[70%] h-10 outline-none border-zinc-600 border p-3 text-[16px] mt-2"
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  function DropDownButton({ data, name, setName }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="relative w-full sm:w-auto">
        <button
          className="flex items-center justify-between border border-gray-400 px-4 py-2 rounded w-full sm:w-56"
          onClick={() => setIsOpen(!isOpen)}
        >
          {name} <FaChevronDown />
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full sm:w-40 bg-gray-100 rounded-sm shadow-lg mt-2">
            {data.map((item) => (
              <div
                key={item}
                className="hover:bg-purple-600 hover:text-white cursor-pointer p-2"
                onClick={() => {
                  setName(item);
                  setIsOpen(false);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function ImageLoader({ imagePreview, onChange }) {
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setFileObj(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => onChange(reader.result);
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="mt-4 flex flex-wrap">
        <h1 className="text-[15px] font-bold">Course Image</h1>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <img
            src={imagePreview}
            alt="Course Photo"
            className="w-40 h-40 sm:w-96 sm:h-96 object-cover border border-gray-300 rounded-md"
          />
          <input
            type="file"
            className="w-full sm:w-auto"
            onChange={handleImageChange}
          />
        </div>
      </div>
    );
  }
}
export default CourseLanding;
