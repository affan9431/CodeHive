import React from 'react';
import { PlayCircle } from 'lucide-react';

export default function CourseStartPage() {
  // Sample course data
  const courseContent = [
    { id: 1, title: "Introduction to React", duration: "10:00" },
    { id: 2, title: "JSX Fundamentals", duration: "15:30" },
    { id: 3, title: "State and Props", duration: "20:15" },
    { id: 4, title: "Hooks in React", duration: "25:00" },
    { id: 5, title: "Building Components", duration: "18:45" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Video Player Section */}
      <div className="md:w-2/3 bg-black flex items-center justify-center p-4">
        <div className="relative w-full aspect-video bg-gray-800 rounded-lg shadow-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-16 h-16 text-white opacity-75 hover:opacity-100 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="md:w-1/3 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Course Content</h2>
        <ul className="space-y-2">
          {courseContent.map((lesson) => (
            <li 
              key={lesson.id} 
              className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{lesson.title}</span>
                <span className="text-sm text-gray-500">{lesson.duration}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}