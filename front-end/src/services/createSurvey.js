import axios from "axios";

export async function createSurvey({ userId, experience, content, students }) {
  try {
    // const res = await axios.post("http://localhost:8080/api/survey", {
    const res = await axios.post(`${import.meta.env.BACKEND_URL}/api/survey`, {
      userId,
      experience,
      content,
      students,
    });
    return res.data.data;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
}
