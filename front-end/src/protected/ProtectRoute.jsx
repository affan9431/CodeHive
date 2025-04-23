import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = () => {
  const token = localStorage.getItem("token"); // Or sessionStorage

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectRoute;
