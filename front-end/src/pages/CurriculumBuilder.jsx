import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../services/supabase";

export default function Component() {
  const { id, title } = useParams();
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Introduction",
      lectures: [
        {
          id: 1,
          title: "Introduction",
          isExpanded: false,
          contentType: null,
          content: null,
          videoFileName: null,
        },
      ],
    },
  ]);

  const [videoFiles, setVideoFiles] = useState({});
  const [courseRecord, setCourseRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    sectionId: null,
    lectureId: null,
    contentType: null,
    articleContent: "",
    videoFile: null,
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data: lectures, error } = await supabase
          .from("Lectures")
          .select("*")
          .eq("course_id", id)
          .single();

        if (error) {
          if (error.code !== "PGRST116") {
            console.error(error);
          }
          return;
        }

        if (lectures) {
          setCourseRecord(lectures);
          setSections(lectures.sections);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSections();
  }, [id]);

  const insertCourse = useCallback(
    async (sectionsToSave) => {
      const payload = {
        course_id: id,
        sections: sectionsToSave,
      };

      const { data, error } = await supabase
        .from("Lectures")
        .insert([payload])
        .select();

      if (error) {
        console.error("Error inserting course:", error);
        throw error;
      }

      return data;
    },
    [id]
  );

  const updateCourse = useCallback(
    async (sectionsToSave) => {
      if (!courseRecord) {
        throw new Error("No course record found to update");
      }

      const payload = {
        sections: sectionsToSave,
      };

      const { data, error } = await supabase
        .from("Lectures")
        .update(payload)
        .eq("course_id", id)
        .select();

      if (error) {
        console.error("Error updating course:", error);
        throw error;
      }

      return data;
    },
    [id, courseRecord]
  );

  const addSection = () => {
    const newSection = {
      id: sections.length + 1,
      title: `Section ${sections.length + 1}`,
      lectures: [],
    };
    setSections([...sections, newSection]);
  };

  const addLecture = (sectionId) => {
    const section = sections.find((section) => section.id === sectionId);
    const newLecture = {
      id: section.lectures.length + 1,
      title: `Lecture ${section.lectures.length + 1}`,
      isExpanded: false,
      contentType: null,
      content: null,
      videoFileName: null,
    };
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, lectures: [...section.lectures, newLecture] }
          : section
      )
    );
  };

  const toggleLecture = (sectionId, lectureId) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) =>
              lecture.id === lectureId
                ? { ...lecture, isExpanded: !lecture.isExpanded }
                : lecture
            ),
          };
        }
        return section;
      })
    );
  };

  const openModal = (sectionId, lectureId, contentType) => {
    setModal({
      isOpen: true,
      sectionId,
      lectureId,
      contentType,
      articleContent: "",
      videoFile: null,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      sectionId: null,
      lectureId: null,
      contentType: null,
      articleContent: "",
      videoFile: null,
    });
  };

  const handleContentSubmission = () => {
    const { sectionId, lectureId, contentType, articleContent, videoFile } =
      modal;

    if (videoFile) {
      setVideoFiles((prev) => ({ ...prev, [videoFile.name]: videoFile }));
    }

    if (contentType === "video" && videoFile) {
      const blobUrl = URL.createObjectURL(videoFile);
      setSections(
        sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                lectures: section.lectures.map((lecture) =>
                  lecture.id === lectureId
                    ? {
                        ...lecture,
                        contentType: "video",
                        content: blobUrl,
                        videoFileName: videoFile.name,
                      }
                    : lecture
                ),
              }
            : section
        )
      );
      closeModal();
    } else if (contentType === "article" && articleContent.trim()) {
      setSections(
        sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                lectures: section.lectures.map((lecture) =>
                  lecture.id === lectureId
                    ? {
                        ...lecture,
                        contentType: "article",
                        content: articleContent,
                      }
                    : lecture
                ),
              }
            : section
        )
      );
      closeModal();
    }
  };

  const uploadVideo = async (file) => {
    if (!file) {
      alert("Please select a video file.");
      return null;
    }
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("lecture-video")
        .upload(fileName, file, {
          contentType: "video/mp4",
        });

      if (error) {
        console.error("Error uploading video:", error);
        alert(`Failed to upload the video: ${file.name}`);
        return null;
      }

      const { data: publicURLData, error: urlError } = supabase.storage
        .from("lecture-video")
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Error getting public URL:", urlError);
        alert(`Failed to get public URL for: ${file.name}`);
        return null;
      }

      return publicURLData.publicUrl;
    } catch (err) {
      console.error("Error during video upload:", err);
      alert("An unexpected error occurred.");
      return null;
    }
  };

  const handleUploadAllVideos = async () => {
    const uploadedVideos = {};
    const fileEntries = Object.entries(videoFiles);
    for (const [fileName, file] of fileEntries) {
      const videoURL = await uploadVideo(file);
      if (videoURL) {
        uploadedVideos[fileName] = videoURL;
      }
    }
    return uploadedVideos;
  };

  const handleSaveCourse = async () => {
    try {
      setIsLoading(true);

      const uploadedVideos = await handleUploadAllVideos();

      let sectionsToSave = sections;
      if (uploadedVideos && Object.keys(uploadedVideos).length > 0) {
        sectionsToSave = sections.map((section) => ({
          ...section,
          lectures: section.lectures.map((lecture) => {
            if (
              lecture.contentType === "video" &&
              lecture.videoFileName &&
              uploadedVideos[lecture.videoFileName]
            ) {
              return {
                ...lecture,
                content: uploadedVideos[lecture.videoFileName],
              };
            }
            return lecture;
          }),
        }));
        setSections(sectionsToSave);
      }

      let result;
      if (courseRecord) {
        result = await updateCourse(sectionsToSave);
      } else {
        result = await insertCourse(sectionsToSave);
      }

      setCourseRecord(result);
      alert("Course saved successfully!");
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {sections.map((section) => (
        <div
          key={section.id}
          className="mb-4 border border-gray-200 rounded-lg p-4"
        >
          <div className="flex flex-wrap items-center gap-2 text-lg font-semibold mb-4">
            <span>Section {section.id}:</span>
            <input
              type="text"
              value={section.title}
              onChange={(e) =>
                setSections(
                  sections.map((s) =>
                    s.id === section.id ? { ...s, title: e.target.value } : s
                  )
                )
              }
              className="border-b-2 border-gray-200 p-1 w-full sm:w-auto"
            />
          </div>

          <div>
            {section.lectures.map((lecture) => (
              <div
                key={lecture.id}
                className="border border-gray-200 rounded-lg mb-2"
              >
                <div
                  onClick={() => toggleLecture(section.id, lecture.id)}
                  className="flex flex-wrap justify-between p-4 cursor-pointer"
                >
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <span>Lecture {lecture.id}:</span>
                    <input
                      type="text"
                      value={lecture.title}
                      onChange={(e) =>
                        setSections(
                          sections.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  lectures: s.lectures.map((l) =>
                                    l.id === lecture.id
                                      ? { ...l, title: e.target.value }
                                      : l
                                  ),
                                }
                              : s
                          )
                        )
                      }
                      className="border-b-2 border-gray-200 p-1 w-full sm:w-auto"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(section.id, lecture.id, "video");
                      }}
                      className="px-3 py-2 border border-gray-200 rounded-md bg-white cursor-pointer text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Add Video
                    </button>
                  </div>
                </div>
                {lecture.contentType === "video" && (
                  <div className="p-4 border-t border-gray-200 bg-gray-100">
                    <video src={lecture.content} controls className="w-full" />
                  </div>
                )}
                {lecture.contentType === "article" && (
                  <div className="p-4 border-t border-gray-200 bg-gray-100">
                    <div
                      dangerouslySetInnerHTML={{ __html: lecture.content }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => addLecture(section.id)}
            className="px-3 py-2 border border-gray-200 rounded-md bg-white cursor-pointer text-xs sm:text-sm w-full sm:w-auto"
          >
            + Lecture
          </button>
        </div>
      ))}

      <button
        onClick={addSection}
        className="px-3 py-2 border border-gray-200 rounded-md bg-white cursor-pointer text-xs sm:text-sm w-full sm:w-auto"
      >
        + Section
      </button>

      <div className="flex">
        <button
          onClick={handleSaveCourse}
          className="mt-4 bg-[#2D2F31] hover:bg-zinc-800 text-white font-semibold py-1 px-4 transition duration-200 w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "...Processing" : "Save"}
        </button>
      </div>

      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add {modal.contentType === "video" ? "Video" : "Article"}
            </h3>
            {modal.contentType === "video" && (
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setModal({ ...modal, videoFile: e.target.files[0] })
                }
                className="w-full mb-4"
              />
            )}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleContentSubmission}
                className="px-4 py-2 bg-blue-500 text-white rounded-md w-full sm:w-auto"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded-md w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
