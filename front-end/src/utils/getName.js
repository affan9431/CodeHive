import { jwtDecode } from "jwt-decode";

export const getName = () => {
  const storedToken = localStorage.getItem("userToken");

  if (!storedToken) {
    console.error("No token found");
    return { decoded: null, storedToken: null };
  }

  try {
    const decoded = jwtDecode(storedToken);
    return { decoded, storedToken };
  } catch (error) {
    console.error("Invalid token:", error);
    return { decoded: null, storedToken: null };
  }
};
