import { Outlet, Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCourses } from "../hooks/useCourses";
import { HiChevronLeft } from "react-icons/hi2";
import { useCourseData } from "../context/CourseContext";
import axios from "axios";
import { getName } from "../utils/getName";
import toast from "react-hot-toast";
import Loader from "../component/Loader";

const courseChecklist = [
  {
    section: "Plan your course",
    items: [{ name: "Intended learners", path: "intended-learners" }],
  },
  {
    section: "Create your content",
    items: [
      { name: "Curriculum", path: "curriculum" },
      { name: "Captions (optional)", path: "captions" },
    ],
  },
  {
    section: "Publish your course",
    items: [
      { name: "Course landing page", path: "course-landing-page" },
      { name: "Pricing", path: "pricing" },
      // { name: "Promotions", path: "promotions" },
      // { name: "Course messages", path: "course-messages" },
    ],
  },
];

function InstructorCourseManage() {
  const { title, id } = useParams();
  const [courses, setCourses] = useState([]);
  const { coursesData, error, isLoading } = useCourses();
  const navigate = useNavigate();
  const { courseData, updateCourseData } = useCourseData();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [allData, setAllData] = useState({
    "intended-learners": [],
    prerequisites: [],
    courseFor: [],
  });
  const [disableDraft, setDisableDraft] = useState(false);
  useEffect(() => {
    const courseData = JSON.parse(localStorage.getItem("courseData")) || [];
    const draftCourse = localStorage.getItem(
      `draftCourse${courseData.map((course) => course.courseTitle)}`
    );
    if (draftCourse) {
      setDisableDraft(true);
    }
  }, []);

  useEffect(() => {
    const localStorageData =
      JSON.parse(localStorage.getItem("courseData")) || [];
    if (coursesData) {
      coursesData.map((course) => {
        localStorageData.map((c) => {
          if (c.courseTitle === course.courseTitle) {
            console.log(course.status);
          }
        });
      });
    }
  }, [coursesData]);
  const { decoded } = getName();

  useEffect(() => {}, [title]);

  const handlePublishCourse = async () => {
    const intendedLearner =
      JSON.parse(localStorage.getItem("intended-learner")) || [];
    const captions = JSON.parse(localStorage.getItem("captions")) || [];
    const courseData = JSON.parse(localStorage.getItem("courseData")) || [];
    const currencyPrice =
      JSON.parse(localStorage.getItem("currencyPrice")) || [];

    let isCourseDataLengthHandled = false;

    for (const course of courseData) {
      const backendCourse = coursesData.find(
        (c) => c.courseTitle === course.courseTitle
      );

      const newCoursePayload = {
        courseFor: intendedLearner[0]?.courseFor || [],
        intendedLearners: intendedLearner[0]?.intendedLearners || [],
        prerequisites: intendedLearner[0]?.prerequisites || [],
        captions: captions[0]?.languages || [],
        courseTitle: course.courseTitle || "",
        courseSubtitle: course.courseSubtitle || "",
        courseDescription: course.courseDescription || "",
        categoryName: course.categoryName || "",
        languageName: course.languageName || "",
        levelName: course.levelName || "",
        promotionalVideo: course.promotionalVideo || null,
        imagePreview: course.imagePreview || null,
        currency: currencyPrice[0]?.currency || "",
        price: currencyPrice[0]?.price || "",
        symbol: currencyPrice[0]?.symbol || "",
        createdBy: decoded.id,
        status: "published",
        isPublished: true,
        randomID: id,
      };

      if (
        !backendCourse &&
        courseData.length === 1 &&
        intendedLearner.length === 1 &&
        captions.length === 1 &&
        currencyPrice.length === 1
      ) {
        await axios.post("http://localhost:8080/api/course", newCoursePayload);
        // await axios.post(
        //   `${import.meta.env.VITE_BACKEND_URL}/api/course`,
        //   newCoursePayload
        // );
      } else if (
        courseData.length === 1 &&
        backendCourse.status === "draft" &&
        intendedLearner.length === 1 &&
        captions.length === 1 &&
        currencyPrice.length === 1
      ) {
        await axios.patch(
          `http://localhost:8080/api/course/${backendCourse._id}`,
          // `${import.meta.env.VITE_BACKEND_URL}/api/course/${backendCourse._id}`,

          newCoursePayload
        );
        toast.success("Your course are successfully created.");

        localStorage.setItem(
          `draftCourse${courseData[0]?.courseTitle}`,
          JSON.stringify(courseData[0]?.courseTitle)
        );
      } else if (
        courseData.length === 1 &&
        backendCourse.status === "published" &&
        intendedLearner.length === 1 &&
        captions.length === 1 &&
        currencyPrice.length === 1
      ) {
        prompt("Are sure you want to update this course with new data? Yes/No");

        await axios.patch(
          `http://localhost:8080/api/course/${backendCourse._id}`,
          // `${import.meta.env.VITE_BACKEND_URL}/api/course/${backendCourse._id}`,
          newCoursePayload
        );
        toast.success("Your course are successfully updated.");
        localStorage.setItem(
          `draftCourse${courseData[0]?.courseTitle}`,
          JSON.stringify(courseData[0]?.courseTitle)
        );
      } else if (courseData.length > 1 && !isCourseDataLengthHandled) {
        isCourseDataLengthHandled = true;
        alert("msg");
        let unMatchedData = [];
        let index = 0;
        for (const course of courseData) {
          coursesData.find((c) => {
            if (c.courseTitle !== course.courseTitle) {
              unMatchedData = course;
              index = courseData.indexOf(course);
            }
          });
        }

        const newCoursePayload = {
          courseFor: intendedLearner[index]?.courseFor || [],
          intendedLearners: intendedLearner[index]?.intendedLearners || [],
          prerequisites: intendedLearner[index]?.prerequisites || [],
          captions: captions[index]?.languages || [],
          courseTitle: unMatchedData.courseTitle || "",
          courseSubtitle: unMatchedData.courseSubtitle || "",
          courseDescription: unMatchedData.courseDescription || "",
          categoryName: unMatchedData.categoryName || "",
          languageName: unMatchedData.languageName || "",
          levelName: unMatchedData.levelName || "",
          promotionalVideo: unMatchedData.promotionalVideo || null,
          imagePreview: unMatchedData.imagePreview || null,
          currency: currencyPrice[index]?.currency || "",
          price: currencyPrice[index]?.price || "",
          symbol: currencyPrice[index]?.symbol || "",
          createdBy: decoded.id,
          status: "published",
          isPublished: true,
          randomID: id,
        };
        toast.success("Your course are successfully created.");

        await axios.post("http://localhost:8080/api/course", newCoursePayload);
        // await axios.post(
        //   `${import.meta.env.VITE_BACKEND_URL}/api/course`,
        //   newCoursePayload
        // );

        localStorage.setItem(
          `draftCourse${courseData[index]?.courseTitle}`,
          JSON.stringify(courseData[index]?.courseTitle)
        );
      }
    }
  };

  const handleDraftCourse = async () => {
    const intendedLearner =
      JSON.parse(localStorage.getItem("intended-learner")) || [];

    const captions = JSON.parse(localStorage.getItem("captions")) || [];
    const courseData = JSON.parse(localStorage.getItem("courseData")) || [];
    const currencyPrice =
      JSON.parse(localStorage.getItem("currencyPrice")) || [];
    const content =
      JSON.parse(localStorage.getItem(`courseSections${title}`)) || [];

    let isCourseDataLengthHandled = false;

    if (
      courseData.length === 1 &&
      intendedLearner.length === 1 &&
      captions.length === 1 &&
      currencyPrice.length === 1
    ) {
      const coursePayload = {
        courseFor: intendedLearner[0]?.courseFor || [],
        intendedLearners: intendedLearner[0]?.intendedLearners || [],
        prerequisites: intendedLearner[0]?.prerequisites || [],
        captions: captions[0]?.languages || [],
        courseTitle: courseData[0]?.courseTitle || "",
        courseSubtitle: courseData[0]?.courseSubtitle || "",
        courseDescription: courseData[0]?.courseDescription || "",
        categoryName: courseData[0]?.categoryName || "",
        languageName: courseData[0]?.languageName || "",
        levelName: courseData[0]?.levelName || "",
        promotionalVideo: null,
        imagePreview: null,
        currency: currencyPrice[0]?.currency || "",
        price: currencyPrice[0]?.price || "",
        symbol: currencyPrice[0]?.symbol || "",
        createdBy: decoded.id,
        status: "draft",
        isPublished: false,
        randomID: id,
      };

      await axios.post("http://localhost:8080/api/course", coursePayload);
      // await axios.post(
      //   `${import.meta.env.VITE_BACKEND_URL}/api/course`,
      //   coursePayload
      // );

      toast.success(
        "We draft your course for now! You can publish it when you ready."
      );

      localStorage.setItem(
        `draftCourse${courseData[0]?.courseTitle}`,
        JSON.stringify(courseData[0]?.courseTitle)
      );
    } else if (courseData.length > 1 && !isCourseDataLengthHandled) {
      alert("from else if if it work let dont touch it!");
      isCourseDataLengthHandled = true;
      let unMatchedData = [];
      let index = 0;
      for (const course of courseData) {
        coursesData.find((c) => {
          if (c.courseTitle !== course.courseTitle) {
            unMatchedData = course;
            index = courseData.indexOf(course);
          }
        });
      }

      const newCoursePayload = {
        courseFor: intendedLearner[index]?.courseFor || [],
        intendedLearners: intendedLearner[index]?.intendedLearners || [],
        prerequisites: intendedLearner[index]?.prerequisites || [],
        captions: captions[index]?.languages || [],
        courseTitle: unMatchedData.courseTitle || "",
        courseSubtitle: unMatchedData.courseSubtitle || "",
        courseDescription: unMatchedData.courseDescription || "",
        categoryName: unMatchedData.categoryName || "",
        languageName: unMatchedData.languageName || "",
        levelName: unMatchedData.levelName || "",
        promotionalVideo: unMatchedData.promotionalVideo || null,
        imagePreview: unMatchedData.imagePreview || null,
        currency: currencyPrice[index]?.currency || "",
        price: currencyPrice[index]?.price || "",
        symbol: currencyPrice[index]?.symbol || "",
        createdBy: decoded.id,
        status: "draft",
        isPublished: false,
        randomID: id,
      };
      await axios.post("http://localhost:8080/api/course", newCoursePayload);
      // await axios.post(
      //   `${import.meta.env.VITE_BACKEND_URL}/api/course`,
      //   newCoursePayload
      // );

      toast.success("We draft your course.");

      localStorage.setItem(
        `draftCourse${courseData[index]?.courseTitle}`,
        JSON.stringify(courseData[index]?.courseTitle)
      );
    }
  };

  const handleChange = (path, value) => {
    setAllData((prevData) => ({
      ...prevData,
      [path]: value,
    }));
    setUnsavedChanges(true);
  };

  useEffect(() => {
    if (coursesData) {
      const userCourses = coursesData.filter(
        (course) => course.title === title
      );
      setCourses(userCourses);
    }
  }, [coursesData, title]);

  const handleBackToCourses = () => {
    if (unsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave without saving?"
      );
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error loading courses. Please try again later.</p>;
  }

  const courseStatus = courses.length > 0 ? courses[0].status : "Inactive";

  return (
    <div>
      <header>
        <nav className="flex items-center bg-[#2D2F31] text-white h-16 gap-3 justify-between p-4 shadow-md">
          <div className="flex items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={handleBackToCourses}
            >
              <HiChevronLeft className="text-xl mr-2" />
              <span className="text-lg font-semibold">Back to course</span>
            </div>
            <div className="ml-4">
              <h1 className="text-xl md:text-2xl font-bold">
                {title}{" "}
                <span className="badge bg-secondary text-white font-medium">
                  {courseStatus}
                </span>
              </h1>
            </div>
          </div>
        </nav>
      </header>
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="w-full md:w-[19rem]">
          {courseChecklist.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="px-6 md:px-8 lg:px-10 py-3 rounded"
            >
              <h3 className="font-bold mb-2">{section.section}</h3>
              <ul className="flex flex-col gap-2">
                {section.items.map((item, itemIndex) => (
                  <Link
                    to={item.path}
                    key={itemIndex}
                    onClick={(e) => {
                      if (unsavedChanges) {
                        e.preventDefault();
                        const confirmLeave = window.confirm(
                          "You have unsaved changes. Are you sure you want to navigate without saving?"
                        );
                        if (confirmLeave) {
                          setUnsavedChanges(false);
                          navigate(item.path);
                        }
                      }
                    }}
                    className="cursor-pointer focus:underline hover:bg-slate-100 rounded hover:text-black px-2"
                  >
                    <li>{item.name}</li>
                  </Link>
                ))}
              </ul>
            </div>
          ))}
          <div className="mt-4 px-4 md:px-6 lg:px-8">
            <button
              onClick={handlePublishCourse}
              className="bg-[#8710D8] hover:bg-[#8710D6] text-white font-semibold py-2 px-4 transition duration-200 w-full md:w-48"
            >
              Publish your course
            </button>
            <button
              onClick={handleDraftCourse}
              className="bg-[#8710D8] hover:bg-[#8710D6] text-white font-semibold py-2 px-4 transition duration-200 w-full md:w-48 mt-2"
              disabled={disableDraft}
            >
              Draft
            </button>
          </div>
        </div>
        {/* Right Content Area */}
        <div
          className="w-full md:w-[70vw] py-3 shadow-lg m-4"
          onChange={handleChange}
        >
          <Outlet context={{ handleChange, allData, setAllData }} />
        </div>
      </div>
    </div>
  );
}

export default InstructorCourseManage;
