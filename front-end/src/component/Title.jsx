import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Title({ step, setStep }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <>
      <div className="w-full h-[50vh] flex items-center justify-center mt-7">
        <div className="flex flex-col items-center w-full max-w-md bg-white p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
            How about a working title?
          </h1>
          <p className="mb-4 text-gray-600 text-center text-sm md:text-base">
            It's ok if you can't think of a good title now. You can change it
            later.
          </p>
          <div>
            <input
              type="text"
              placeholder="e.g. Learn Photoshop CS6 from Scratch"
              className="w-full p-2 border border-gray-300 rounded mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="e.g. Learn Photoshop CS6 from Scratch"
              className="w-full p-2 border border-gray-300 rounded"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Title;
