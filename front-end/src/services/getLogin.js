import axios from "axios";

export async function getLogin({ email, password }) {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/users/signin",
      // `${import.meta.env.VITE_BACKEND_URL}/api/users/signin`,
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
