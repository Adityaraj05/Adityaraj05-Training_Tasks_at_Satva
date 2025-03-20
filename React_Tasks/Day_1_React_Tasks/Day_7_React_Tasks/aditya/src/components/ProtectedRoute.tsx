import {  useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { verifyToken, logout } from "../store/authSlice"; // Import verifyToken and logout actions

const ProtectedRoute = () => {
  const dispatch: AppDispatch = useDispatch();
  const location =useLocation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(verifyToken());
    } else {
      dispatch(logout(false)); // Pass false to avoid duplicate notification
    }
  }, [dispatch, token,location.pathname]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;