import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = () => {
  const token = localStorage.getItem('userToken'); // Or sessionStorage

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectRoute;
