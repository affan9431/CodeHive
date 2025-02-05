import axios from "axios";

export async function getLogin({ email, password }) {
  try {
    // const res = await axios.post("http://localhost:8080/api/users/signin", {
    const res = await axios.post(
      `${import.meta.env.BACKEND_URL}/api/users/signin`,
      {
        email,
        password,
      }
    );

    return res.data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error(error);
  }
}
