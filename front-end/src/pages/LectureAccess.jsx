import { useEffect, useState } from "react";
import { Star, Share2, MoreVertical, ChevronDown, Menu, X } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import supabase from "../services/supabase";
import { HiChevronDown } from "react-icons/hi2";
import { useCourses } from "../hooks/useCourses";
import { getName } from "../utils/getName";
import QASection from "../component/QASection";
import NotesSection from "../component/NotesSection";
import AnnouncementsSection from "../component/AnnouncementsSection";
import ReviewsSection from "../component/ReviewsSection";
import LearningToolsSection from "../component/LearningToolsSection";

export default function LectureAccess() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { title, id } = useParams();
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { decoded } = getName();
  const [currentLectureTitle, setCurrenLectureTitle] = useState("");
  const [currentLectureURL, setCurrentLectureURL] = useState("");
  const [toggledSections, setToggledSections] = useState({});
  const [lectureCompletedCount, setLectureCompletedCount] = useState(0);
  const [AllpurchasedCourse, setAllPurchasedCourse] = useState([]);
  const [purchasedCourse, setPurchasedCourse] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [durations, setDurations] = useState({});
  const [isloading, setIsLoading] = useState(false);

  // Format duration in seconds to MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleCourseCompletedState = (maxValue, value) => {
    if (value <= maxValue) {
      setLectureCompletedCount(value);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        // const res = await axios.get("http://localhost:8080/api/purchase");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/purchase`
        );
        setAllPurchasedCourse(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const filteredCourses = AllpurchasedCourse.filter(
      (item) => item.purchasedBy._id === decoded.id
    );
    setPurchasedCourse(filteredCourses);
  }, [AllpurchasedCourse, decoded.id]);

  const handleToggle = (index) => {
    setToggledSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    async function getReviews() {
      try {
        // const res = await axios.get(
        //   "http://localhost:8080/api/review/getReviews"
        // );
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/review/getReviews`
        );
        const foundCourse = res.data.data.filter(
          (review) => review.courseID._id === id
        );
        if (foundCourse) setReviews(foundCourse);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    getReviews();
  }, [id]);

  const sumOfReview = reviews.reduce((acc, review) => acc + review.rating, 0);
  const avgRating = sumOfReview / reviews.length;

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        if (purchasedCourse?.[0]?.course) {
          const { data: Lectures, error } = await supabase
            .from("Lectures")
            .select("*")
            .eq("course_id", purchasedCourse[0]?.course?.randomID);

          if (error) console.log(error);

          if (Lectures) {
            setContent(Lectures);

            // Preload durations for all lectures
            Lectures.forEach((sectionGroup) => {
              sectionGroup.sections.forEach((section) => {
                section.lectures.forEach((lecture) => {
                  const video = document.createElement("video");
                  video.preload = "metadata";
                  video.src = lecture.content;
                  video.addEventListener("loadedmetadata", () => {
                    setDurations((prev) => ({
                      ...prev,
                      [lecture.content]: Math.floor(video.duration),
                    }));
                  });
                });
              });
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourseContent();
  }, [purchasedCourse]);

  useEffect(() => {
    if (content.length > 0 && content[0].sections.length > 0) {
      const firstSection = content[0].sections[0];
      if (firstSection.lectures.length > 0) {
        const firstLecture = firstSection.lectures[0];
        setCurrentLectureURL(firstLecture.content);
        setCurrenLectureTitle(firstLecture.title);
      }
    }
  }, [content]);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      // Check if payment has already been verified
      const paymentVerified = localStorage.getItem("paymentVerified");

      if (sessionId && !paymentVerified) {
        try {
          // const response = await axios.post(
          //   "http://localhost:8080/api/payment/verify",
          //   { sessionId }
          // );
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
            { sessionId }
          );
          if (response.data.status === "success") {
            alert("Payment verified successfully!");
            // Set the flag in localStorage to prevent future verification
            localStorage.setItem("paymentVerified", "true");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      }
    };

    verifyPayment();
  }, [sessionId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, notesRes, announcementsRes] = await Promise.all([
          // axios.get(`http://localhost:8080/api/questions`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/questions`),
          // axios.get(`http://localhost:8080/api/notes/${decoded.id}/${id}`),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/notes/${decoded.id}/${id}`
          ),
          // axios.get(`http://localhost:8080/api/announcements/${id}`),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/announcements/${id}`
          ),
        ]);
        setQuestions(questionsRes.data.data);
        setNotes(notesRes.data.data);
        setAnnouncements(announcementsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id, decoded.id]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "qa", label: "Q&A" },
    { id: "notes", label: "Notes" },
    { id: "announcements", label: "Announcements" },
    { id: "reviews", label: "Reviews" },
    { id: "learning-tools", label: "Learning tools" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <img
            src={`/test-react.png`}
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-lg font-medium hidden sm:block">{title}</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <video
            className="w-full h-screen object-cover"
            src={
              currentLectureURL || "https://www.w3schools.com/tags/movie.mp4"
            }
            controls
            poster="https://via.placeholder.com/1280x720"
          >
            Your browser does not support the video tag.
          </video>

          <div className="p-4">
            <div className="border-b">
              <div className="flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-b-2 border-purple-600 text-purple-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "overview" && (
              <div className="mt-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                  {title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-purple-600 text-purple-600" />
                    <span className="font-medium text-gray-900">
                      {avgRating}
                    </span>
                    <span>({reviews?.length} ratings)</span>
                  </div>
                  <div>{purchasedCourse?.length} Students</div>
                  <div>84 hours Total</div>
                  <div>Last updated December 2024</div>
                </div>
              </div>
            )}

            {activeTab === "qa" && (
              <QASection
                questions={questions}
                courseId={id}
                userId={decoded.id}
              />
            )}
            {activeTab === "notes" && (
              <NotesSection notes={notes} courseId={id} userId={decoded.id} />
            )}
            {activeTab === "announcements" && (
              <AnnouncementsSection announcements={announcements} />
            )}
            {activeTab === "reviews" && (
              <ReviewsSection
                reviews={reviews}
                courseId={id}
                userId={decoded.id}
              />
            )}
            {activeTab === "learning-tools" && (
              <LearningToolsSection courseId={id} />
            )}
          </div>
        </div>

        <div
          className={`fixed inset-y-0 right-0 md:relative md:block bg-white transform ${
            isSidebarOpen
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0"
          } transition-transform duration-300 ease-in-out z-50 w-full sm:max-w-sm md:w-96 md:border-l overflow-hidden`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">Course content</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-md"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-2 overflow-y-auto h-full">
            {content?.map((section, sectionIndex) =>
              section.sections.map((item, index) => (
                <div key={`${sectionIndex}-${index}`}>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => handleToggle(index)}
                  >
                    <div className="cursor-pointer">
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-600">
                        {lectureCompletedCount}/{item.lectures.length}
                      </p>
                    </div>
                    <div>
                      <HiChevronDown className="w-5 h-5 cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    {toggledSections[index] && (
                      <div>
                        {item.lectures.map((lecture) => (
                          <div
                            key={lecture.id}
                            className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                            onClick={() => {
                              setCurrenLectureTitle(lecture.title);
                              setCurrentLectureURL(lecture.content);
                            }}
                          >
                            <input
                              type="checkbox"
                              className="mt-1 h-4 w-4 rounded border-gray-300 cursor-pointer accent-black"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                if (isChecked) {
                                  handleCourseCompletedState(
                                    item.lectures.length,
                                    lectureCompletedCount + 1
                                  );
                                } else {
                                  handleCourseCompletedState(
                                    item.lectures.length,
                                    lectureCompletedCount - 1
                                  );
                                }
                              }}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {lecture.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDuration(durations[lecture.content])}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
