import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import axios from "axios";
import { getName } from "../utils/getName";
import toast from "react-hot-toast";

const survey = localStorage.getItem("survey");

export default function Header() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { decoded, storedToken } = getName();
  const [userData, setUserData] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (storedToken) {
      queryClient.setQueryData(["user"], {
        token: storedToken,
        userName: decoded.userName,
      });
      setUserName(decoded.userName);
    } else {
      const cachedUser = queryClient.getQueryData(["user"]);
      if (cachedUser) {
        setUserName(cachedUser.userName);
      }
    }
  }, [queryClient, decoded, storedToken]);

  useEffect(() => {
    async function getUserById() {
      if (decoded && decoded.id) {
        try {
          const res = await axios.get(
            // `http://localhost:8080/api/users/${decoded.id}`
            `${import.meta.env.BACKEND_URL}/api/users/${decoded.id}`
          );
          setUserData(res.data.data);
        } catch (error) {
          console.log(error);
        }
      }
    }
    getUserById();
  }, []);

  const user = queryClient.getQueryData(["user"]);

  const handleLogout = () => {
    queryClient.removeQueries(["user"]);
    localStorage.removeItem("userToken");
    toast.success("Log Out Successfull!");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/app/profile");
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/app" className="text-xl font-bold text-gray-800">
              <img
                src="/codehive.jpg"
                className="w-14 h-14"
                alt="Code Hive Logo"
              />
            </Link>
          </div>

          {/* Hamburger Menu Icon */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Links for larger screens */}
          <div className="hidden sm:flex items-center space-x-8 text-xs sm:text-[1rem]">
            <Link
              to="/app/security"
              className="text-gray-600 hover:text-gray-900"
            >
              Security and help
            </Link>
            {userName && survey ? (
              <Link
                to="/instructor"
                className="text-gray-600 hover:text-gray-900"
              >
                Instructor
              </Link>
            ) : (
              <Link
                to="/app/startBuisness"
                className="text-gray-600 hover:text-gray-900"
              >
                Start Your Business
              </Link>
            )}
            <Link
              to="/app/my-courses/learning"
              className="text-gray-600 hover:text-gray-900"
            >
              My Course
            </Link>
            <Link
              to="/app/live-tuting"
              className="text-gray-600 hover:text-gray-900"
            >
              Live Tuting
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={handleProfile}
                >
                  <img
                    src={
                      userData && userData.imageUrl
                        ? userData.imageUrl
                        : "../../public/default.jpg"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-lg font-semibold text-gray-800">
                    {userData && userData.userName
                      ? userData.userName.split(" ")[0]
                      : userName.split(" ")[0]}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-[50px] border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-[50px] border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden flex flex-col space-y-4 mt-4">
            <Link
              to="/app/security"
              className="text-gray-600 hover:text-gray-900"
            >
              Security and help
            </Link>
            {userName && survey ? (
              <Link
                to="/instructor"
                className="text-gray-600 hover:text-gray-900"
              >
                Instructor
              </Link>
            ) : (
              <Link
                to="/app/startBuisness"
                className="text-gray-600 hover:text-gray-900"
              >
                Start Your Business
              </Link>
            )}
            <Link
              to="/app/my-courses/learning"
              className="text-gray-600 hover:text-gray-900"
            >
              My Course
            </Link>
            <Link
              to="/app/live-tuting"
              className="text-gray-600 hover:text-gray-900"
            >
              Live Tuting
            </Link>
            {user ? (
              <>
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={handleProfile}
                >
                  <img
                    src={
                      userData && userData.imageUrl
                        ? userData.imageUrl
                        : "../../public/default.jpg"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-lg font-semibold text-gray-800">
                    {userData && userData.userName
                      ? userData.userName.split(" ")[0]
                      : userName.split(" ")[0]}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-[50px] border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-[50px] border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
