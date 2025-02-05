import React, { useEffect, useState } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { getName } from "../utils/getName";
import { useParams } from "react-router-dom";

const { decoded } = getName();

function Caption() {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [languageName, setLanguageName] = useState("English (US)");
  const [dropdownLanguages, setDropdownLanguages] = useState(["English (US)"]);
  const { id } = useParams();

  const allLanguages = [
    "Arabic",
    "Afrikaans",
    "Albanian",
    "Armenian",
    "Aymara",
    "Azeri",
    "Basque",
    "Bengali",
    "Bosnian",
    "Bulgarian",
    "Burmese",
    "Catalan",
    "Cherokee",
    "Croatian",
  ];

  useEffect(() => {
    const savedCaptions = JSON.parse(localStorage.getItem("captions")) || [];

    const matchData = savedCaptions.find(
      (item) => item.userId === decoded.id && item.courseID === id
    );

    matchData && setDropdownLanguages(matchData.languages || ["English (US)"]);
    matchData && setLanguageName(matchData.selectedLanguage || "English (US)");
  }, [id]);

  const addLanguageToDropdown = (language) => {
    if (!dropdownLanguages.includes(language)) {
      setDropdownLanguages([...dropdownLanguages, language]);
    }
    setLanguageName(language);
    setIsOpenModal(false);
  };

  const handleSave = () => {
    const newCaption = {
      userId: decoded.id,
      courseID: id,
      languages: dropdownLanguages,
      selectedLanguage: languageName,
    };

    const existingCaptions = JSON.parse(localStorage.getItem("captions")) || [];

    const updateCaptionIndex = existingCaptions.findIndex(
      (item) => item.userId === decoded.id && item.courseID === id
    );

    if (updateCaptionIndex !== -1) {
      existingCaptions[updateCaptionIndex] = newCaption;
    } else {
      existingCaptions.push(newCaption);
    }
    localStorage.setItem("captions", JSON.stringify(existingCaptions));
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-6">
        <h1 className="mx-6 my-2 text-2xl font-semibold">Captions</h1>
        <button
          onClick={() => setIsOpenDropdown(!isOpenDropdown)}
          className="flex items-center gap-2 border border-gray-400 px-4 py-2 rounded"
        >
          {languageName}
          <FaChevronDown />
        </button>
      </div>

      {isOpenDropdown && (
        <div className="absolute mt-2 bg-white border border-gray-200 shadow-lg rounded w-48 z-10">
          <ul className="py-2">
            {dropdownLanguages.map((language, index) => (
              <li
                key={index}
                onClick={() => {
                  setLanguageName(language);
                  setIsOpenDropdown(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {language}
              </li>
            ))}
            <li
              onClick={() => {
                setIsOpenDropdown(false);
                setIsOpenModal(true);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-purple-950"
            >
              Add new language
            </li>
          </ul>
        </div>
      )}

      <div className="w-full h-[1px] bg-slate-300 mt-4"></div>
      <p className="mx-6 my-2">
        Learners of all levels of language proficiency highly value subtitles as
        it helps follow, understand, and memorize the content. Also, having
        subtitles ensures the content is accessible for those that are deaf or
        hard of hearing. Learn more.
      </p>

      <div>
        <button
          onClick={handleSave}
          className="bg-[#2D2F31] hover:bg-[#2D2F32] text-white font-semibold py-1 px-4 transition duration-200 mx-4"
        >
          Save
        </button>
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white w-64 max-h-[70vh] overflow-y-auto rounded-lg shadow-lg">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h2 className="font-semibold">Cancel</h2>
              <button
                onClick={() => setIsOpenModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <ul className="p-4 space-y-2">
              {allLanguages.map((language, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-purple-700"
                  onClick={() => addLanguageToDropdown(language)}
                >
                  {language}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Caption;
