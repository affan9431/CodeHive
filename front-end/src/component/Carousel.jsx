import React from "react";

function Carousel() {
  return (
    <div className="hero-container bg-purple-50 flex flex-col md:flex-row items-center py-10 px-4 md:px-20">
      {/* Text Content */}
      <div className="text-content mb-8 md:mb-0 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 w-full md:w-[40vw] md:pl-10">
          Develop your skills in a new and unique way
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg mt-4 w-full md:w-[40vw] md:pl-10">
          Explore a transformative approach to skill development on our online
          learning platform. Uncover a new realm of learning experiences and
          elevate your expertise in unique ways.
        </p>
      </div>

      {/* Image Content */}
      <div className="image-content relative w-full md:w-1/2">
        <img
          src="/hero.png"
          alt="Hero"
          className="max-w-full h-auto mx-auto"
        />
      </div>
    </div>
  );
}

export default Carousel;
