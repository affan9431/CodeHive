import { Link } from "react-router-dom";
import React from "react";

const perks = [
  { title: "Global Impact", id: 1 },
  { title: "Creative Freedom", id: 2 },
  { title: "Flexible Schedule", id: 3 },
  { title: "Monetize Your Expertise", id: 4 },
  { title: "Innovative Teaching Tools", id: 5 },
  { title: "Professional Development", id: 6 },
  { title: "Recognition", id: 7 },
  { title: "Networking Opportunities", id: 8 },
];

function HomeSection3() {
  return (
    <div className="flex flex-col md:flex-row justify-around items-center mt-16 md:mt-28 px-4 md:px-16">
      {/* Text Section */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          If You Are A Certified Teacher <br /> Then{" "}
          <span className="text-[#D186E8]">Become An Instructor</span>
        </h1>
        <p className="mt-4 mb-4 text-gray-700 text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          quos culpa nostrum vero inventore, molestiae modi numquam at ut qui
          temporibus earum delectus deleniti alias atque ullam odio. Similique,
          mollitia.
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Enjoy Many Perks
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-4 max-w-md md:max-w-lg mx-auto md:mx-0">
          {perks.map((item) => (
            <div key={item.id} className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#AF6AFF]"></div>
              <h1 className="ml-4 text-base sm:text-lg">{item.title}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center">
        <img
          src="/hero3.png"
          alt="Instructor"
          className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain"
        />
      </div>
    </div>
  );
}

export default HomeSection3;
