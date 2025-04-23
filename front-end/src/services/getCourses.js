import axios from "axios";

export async function getCourses() {
  try {
    const res = await axios.get("http://localhost:8080/api/course");
    // const res = await axios.get(
    //   `${import.meta.env.VITE_BACKEND_URL}/api/course`
    // );
    return res.data.data.courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error(error);
  }
}
//
