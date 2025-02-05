import axios from "axios";

export async function getSignUp({ userName, email, password }) {
  try {
    const res = await axios.post("http://localhost:8080/api/users/signup", {
      userName,
      email,
      password,
    });

    return res.data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error(error);
  }
}
