import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useSurvey } from "../hooks/useSurvey";

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
  >
    {children}
  </button>
);

export default function TeachingSurvey() {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    experience: "",
    content: "",
    students: "",
  });

  const { createSurvey, isLoading } = useSurvey();
  const userIdRef = useRef(null);

  const handleSelection = (category, value) => {
    setSelections((prev) => ({ ...prev, [category]: value }));
  };

  useEffect(() => {
    const data = localStorage.getItem("token");
    if (data) {
      const decoded = jwtDecode(data);
      userIdRef.current = decoded.id;
    }
  }, []);

  const handleNext = async () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      const { experience, content, students } = selections;
      try {
        createSurvey({
          userId: userIdRef.current,
          experience,
          content,
          students,
        });
        localStorage.setItem("survey", userIdRef.current);
        setTimeout(() => {
          location.href = "http://localhost:5173/instructor";
          // location.href = `${import.meta.env.VITE_FRONTEND_URL}/instructor`;
        }, 1000);
      } catch (error) {
        console.error("Error submitting survey:", error);
      }
    }
  };

  const steps = [
    {
      question: "Are you new to teaching?",
      category: "experience",
      options: [
        { label: "I'm new to teaching", value: "new" },
        { label: "I have some experience", value: "some" },
        { label: "I'm an experienced teacher", value: "experienced" },
      ],
    },
    {
      question: "Do you have teaching content ready?",
      category: "content",
      options: [
        { label: "I have video content ready", value: "video" },
        { label: "I have course material for beginners", value: "beginner" },
        { label: "I'm still preparing my content", value: "preparing" },
      ],
    },
    {
      question: "Do you already have students?",
      category: "students",
      options: [
        { label: "I don't have any students yet", value: "none" },
        { label: "I have a small student base", value: "small" },
        { label: "I have an established student base", value: "established" },
      ],
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl flex overflow-hidden">
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Start Your Teaching Journey
          </h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {currentStep.question}
            </h2>
            <div className="space-y-4">
              {currentStep.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleSelection(currentStep.category, option.value)
                  }
                  className={`w-full text-left p-4 rounded-lg border transition duration-150 ease-in-out ${
                    selections[currentStep.category] === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleNext}
            disabled={!selections[currentStep.category]}
          >
            {step === 3 ? "Finish" : "Next"}
          </Button>
          <div className="mt-4 text-center text-sm text-gray-500">
            Step {step} of 3
          </div>
        </div>
        <div className="hidden md:block w-1/2 bg-slate-100 p-12 text-black">
          <h2 className="text-3xl font-bold mb-6">
            Empower Others with Your Knowledge
          </h2>
          <p className="text-xl mb-8">
            Join thousands of instructors who are sharing their expertise and
            making a difference in students' lives.
          </p>
          <img
            src="./../../public/teacher.jpg"
            alt="Teacher interacting with students"
            className="rounded-lg shadow-lg"
          />
          <ul className="mt-8 space-y-2">
            <li className="flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Reach students around the world
            </li>
            <li className="flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Earn money sharing your expertise
            </li>
            <li className="flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Inspire and motivate learners
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
