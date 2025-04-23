import React, { useEffect, useState } from "react";
import SearchBar from "../component/SearchBar";
import { useNavigate, useParams } from "react-router-dom";

function SearchResult() {
  const [queryData, setQueryData] = useState([]);
  const { name } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("queryData"));
    if (data && data.length > 0) {
      setQueryData(data);
    }
  }, [name]);

  return (
    <div>
      <SearchBar />
      <div>
        <div className="m-3">
          <h2 className="text-4xl font-bold ">
            {queryData.length} results for
            <span className="italic">"{name}"</span>
          </h2>
        </div>

        {queryData.length === 0 ? (
          <div className="m-3 text-center">
            <h3 className="text-xl font-semibold">No results found</h3>
          </div>
        ) : (
          queryData.map((course) => {
            return (
              <div key={course.courseTitle}>
                <div className="flex flex-wrap gap-5">
                  <div
                    className="flex gap-5 m-5 cursor-pointer flex-wrap"
                    onClick={() => navigate(`/app/courseDetail/${course._id}`)}
                  >
                    <div>
                      <img
                        src={course.imagePreview}
                        alt=""
                        className="w-64  rounded-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="font-bold">{course?.courseTitle}</h1>
                      <p className="truncate">{course?.courseSubtitle}</p>
                      <p>Created By: {course?.createdBy?.userName}</p>
                      <p>
                        {course?.symbol} {course?.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SearchResult;
