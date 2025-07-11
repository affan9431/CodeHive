import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiBars3CenterLeft } from "react-icons/hi2";
import { getName } from "../utils/getName";
import axios from "axios";

export default function Header({ setShowSidebar, showSidebar }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { decoded, storedToken } = getName();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function getUserById() {
      if (decoded && decoded.id) {
        try {
          const res = await axios.get(
            // `http://localhost:8080/api/users/${decoded.id}`
            `${import.meta.env.VITE_BACKEND_URL}/api/users/${decoded.id}`
          );
          setUserData(res.data.data);
        } catch (error) {
          console.log(error);
        }
      }
    }
    getUserById();
  }, []);

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

  const user = queryClient.getQueryData(["user"]);

  const handleLogout = () => {
    queryClient.removeQueries(["user"]);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 focus:outline-none">
              <HiBars3CenterLeft
                className="w-6 h-6"
                onClick={() => setShowSidebar(!showSidebar)}
              />{" "}
            </button>
            <Link to="/instructor" className="text-xl font-bold text-gray-800">
              <img
                src="/codehive.jpg"
                className="w-14 h-14 hidden sm:block"
                alt="Code Hive Logo"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-8 ">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Student
            </Link>
            {user && (
              <div className="flex items-center space-x-4">
                <img
                  src={
                    userData && userData.imageUrl
                      ? userData.imageUrl
                      : "/default.jpg"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-lg font-semibold text-gray-800">
                  {userData && userData.userName
                    ? userData.userName.split(" ")[0]
                    : userName.split(" ")[0]}
                </p>
                <button
                  onClick={handleLogout}
                  className="rounded-[50px] border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
