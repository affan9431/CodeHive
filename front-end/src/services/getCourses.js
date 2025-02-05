import axios from "axios";

export async function getCourses() {
  try {
    const res = await axios.get("http://localhost:8080/api/course");
    return res.data.data.courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error(error);
  }
}
