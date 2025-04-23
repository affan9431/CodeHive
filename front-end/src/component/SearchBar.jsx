import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const courseCategories = [
  "Web Development",
  "Mobile App Development",
  "Game Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Blockchain Development",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Graphic Design",
  "Digital Marketing",
  "SEO & Content Writing",
  "Software Engineering",
  "Backend Development",
  "Frontend Development",
  "Full Stack Development",
  "Database Management",
  "Big Data",
  "Networking & System Administration",
  "Computer Science Fundamentals",
  "Programming Languages",
  "C & C++",
  "Java",
  "Python",
  "JavaScript",
  "React.js",
  "Vue.js",
  "Next.js",
  "Node.js",
  "Django",
  "Flask",
  "Swift & iOS Development",
  "Kotlin & Android Development",
  "AR/VR Development",
  "Ethical Hacking",
  "Cloud Certifications (AWS, Azure, GCP)",
  "Soft Skills & Career Development",
];

function debounce(cb, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [queryData, setQueryData] = useState([]);
  const [hideResult, setHideResult] = useState(true);
  const navigate = useNavigate();
  const [debounceVal, setDebounceVal] = useState("");

  const debouncedChange = debounce((inputValue) => {
    console.log("Debounced:", inputValue);
    setDebounceVal(inputValue);
  }, 2000);

  useEffect(() => {
    setHideResult(searchTerm.length === 0);
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setHideResult(false);
    debouncedChange(event.target.value);
  };

  const handleSelectSuggestion = (course) => {
    setHideResult(true);
    setTimeout(() => setSearchTerm(course), 100); // Delayed update to prevent flickering
  };

  const handleSearch = async () => {
    // Uncomment this when using API search
    try {
      const res = await axios.get(
        `http://localhost:8080/api/course/search?q=${searchTerm}`
        // `${import.meta.env.VITE_BACKEND_URL}/api/course/search?q=${searchTerm}`
      );
      setQueryData(res.data.data.courses);
      console.log(res.data.data.courses);
      if (res.data.status === "success") {
        sessionStorage.setItem(
          "queryData",
          JSON.stringify(res.data.data.courses)
        );
        setTimeout(() => {
          navigate(`/app/search/${searchTerm}`, { replace: true });
        }, 500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter course categories based on search input
  const filteredCategories = courseCategories.filter((course) =>
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4">
      <form
        className="flex flex-col sm:flex-row items-center gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Search Input */}
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleSearchChange}
            value={searchTerm}
          />
          {/* Suggestions Dropdown */}
          {!hideResult && filteredCategories.length > 0 && (
            <div className="bg-[#2D2F31] text-white p-2 absolute w-full z-10 rounded-sm shadow-lg">
              {filteredCategories.map((course, index) => (
                <p
                  key={index}
                  className="hover:bg-gray-600 cursor-pointer p-2 rounded"
                  onClick={() => {
                    handleSelectSuggestion(course);
                    handleSearch();
                  }}
                >
                  {course}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="w-full sm:w-auto">
          <button
            type="submit"
            className="w-full sm:w-32 bg-[#2D2F31] hover:bg-[#2D2F32] text-white font-semibold py-2 px-6"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
