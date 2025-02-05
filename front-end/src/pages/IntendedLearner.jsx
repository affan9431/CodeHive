import { useEffect, useState } from "react";
import { HiMiniPlus } from "react-icons/hi2";
import { useOutletContext, useParams } from "react-router-dom";
import { getName } from "../utils/getName";

const { decoded } = getName();

const Placeholders1 = [
  "Example: Define the roles and responsibilities of a project manager",
  "Example: Estimate project timelines and budgets",
  "Example: Identify and manage project risks",
  "Example: Complete a case study to manage a project from conception to completion",
];
const Placeholders2 = [
  "Example: No programming experience needed. You will learn everything you need to know",
];
const Placeholders3 = [
  "Example: Beginner Python developers curious about data science",
];

function IntendedLearner() {
  const { allData, setAllData } = useOutletContext();
  const [isDirty, setIsDirty] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const storedData =
      JSON.parse(localStorage.getItem("intended-learner")) || [];

    const existingEntry = storedData.find(
      (entry) => entry.userId === decoded.id && entry.courseID === id
    );

    if (
      existingEntry &&
      JSON.stringify(existingEntry) !== JSON.stringify(savedData)
    ) {
      setSavedData(existingEntry);
    } else if (!existingEntry && savedData !== null) {
      setSavedData(null);
    }
  }, [id, savedData]);

  const handleSave = () => {
    const storedData =
      JSON.parse(localStorage.getItem("intended-learner")) || [];

    const existingEntryIndex = storedData.findIndex(
      (entry) => entry.userId === decoded.id && entry.courseID === id
    );

    if (existingEntryIndex !== -1) {
      storedData[existingEntryIndex] = {
        userId: decoded.id,
        courseID: id,
        intendedLearners: allData["intended-learners"] || [],
        prerequisites: allData["prerequisites"] || [],
        courseFor: allData["courseFor"] || [],
      };
    } else {
      storedData.push({
        userId: decoded.id,
        courseID: id,
        intendedLearners: allData["intended-learners"] || [],
        prerequisites: allData["prerequisites"] || [],
        courseFor: allData["courseFor"] || [],
      });
    }

    localStorage.setItem("intended-learner", JSON.stringify(storedData));
    setIsDirty(false);
  };

  return (
    <div>
      <h1 className="mx-6 my-2 text-2xl font-semibold">Intended Learner</h1>
      <div className="w-full h-[1px] bg-slate-300"></div>
      <Box
        initialArraySize={4}
        title="What will students learn in your course?"
        paragraph="You must enter at least 4 learning objectives or outcomes that learners can expect to achieve after completing your course."
        initialPlaceholders={Placeholders1}
        fieldName="intended-learners"
        allData={allData}
        setAllData={setAllData}
        isDirty={isDirty}
        setIsDirty={setIsDirty}
        savedData={savedData}
        name="intendedLearners"
      />
      <Box
        initialArraySize={1}
        title="What are the requirements or prerequisites for taking your course?"
        paragraph="List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, use this space as an opportunity to lower the barrier for beginners."
        initialPlaceholders={Placeholders2}
        fieldName="prerequisites"
        allData={allData}
        setAllData={setAllData}
        isDirty={isDirty}
        setIsDirty={setIsDirty}
        savedData={savedData}
        name="prerequisites"
      />
      <Box
        initialArraySize={1}
        title="Who is this course for?"
        paragraph="Write a clear description of the intended learners for your course who will find your course content valuable. This will help you attract the right learners to your course."
        initialPlaceholders={Placeholders3}
        fieldName="courseFor"
        allData={allData}
        setAllData={setAllData}
        isDirty={isDirty}
        setIsDirty={setIsDirty}
        savedData={savedData}
        name="courseFor"
      />
      <div onClick={handleSave}>
        <button className="bg-[#2D2F31] hover:bg-[#2D2F32] text-white font-semibold py-1 px-4 transition duration-200 mx-4">
          Save
        </button>
      </div>
    </div>
  );
}

function Box({
  initialArraySize,
  title,
  paragraph,
  initialPlaceholders,
  fieldName,
  allData,
  setAllData,
  isDirty,
  setIsDirty,
  savedData,
  name,
}) {
  const [inputBox, setInputBox] = useState([]);
  const [placeholders, setPlaceholders] = useState(initialPlaceholders);

  useEffect(() => {
    if (savedData && savedData[name]) {
      const existingData = savedData[name];

      const defaultDataLength = Math.max(existingData.length, initialArraySize);
      setInputBox(
        existingData.concat(
          new Array(defaultDataLength - existingData.length).fill("")
        )
      );
    } else {
      setInputBox(new Array(initialArraySize).fill(""));
    }
  }, [savedData, name, initialArraySize]);

  const addInputBox = () => {
    setInputBox((prev) => [...prev, ""]);
    setPlaceholders((prev) => [
      ...prev,
      `Example: New learning objective ${placeholders.length + 1}`,
    ]);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        const message = "Changes you made may not be saved.";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleInputChange = (index, value) => {
    const updatedInputBox = [...inputBox];
    updatedInputBox[index] = value;
    setInputBox(updatedInputBox);
    setIsDirty(true);

    setAllData((prevData) => ({
      ...prevData,
      [fieldName]: updatedInputBox,
    }));
  };

  return (
    <div className="mx-6 md:mx-6 my-7 w-[65vw] md:w-[65vw] m-auto">
      <h1 className="font-bold mb-2 text-lg md:text-lg lg:text-lg">{title}</h1>
      <p className="mb-3 text-[14px] md:text-[14px] lg:text-[14px]">
        {paragraph}
      </p>
      <div className="flex flex-col space-y-4">
        {inputBox.map((value, index) => (
          <input
            className="w-full md:w-[70%] h-10 outline-none border-zinc-600 border-1 p-3 text-xs md:text-xs lg:text-xs"
            key={index}
            type="text"
            placeholder={placeholders[index]}
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <div
        className="flex items-center text-[#371783] font-semibold mt-4 cursor-pointer gap-2 w-full md:w-[25%] lg:w-[25%]"
        onClick={addInputBox}
      >
        <HiMiniPlus /> <span className="">Add more to your response</span>
      </div>
    </div>
  );
}

export default IntendedLearner;
