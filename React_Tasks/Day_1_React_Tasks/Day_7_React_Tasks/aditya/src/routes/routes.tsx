import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import JobList from "../pages/JobList";
import AddJob from "../pages/AddJob";
import EditJob from "../pages/EditJob"; // Import EditJob
import EditProfile from "../pages/EditProfile";
import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../components/Layout";

const routes = createBrowserRouter([
  { path: "/", element: <Navigate to="/signup" /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/jobs",
        element: <AppLayout><JobList /></AppLayout>,
      },
      {
        path: "/add-job",
        element: <AppLayout><AddJob /></AppLayout>,
      },
      {
        path: "/edit-job/:id", 
        element: <AppLayout><EditJob /></AppLayout>,
      },
      {
        path: "/profile",
        element: <AppLayout><EditProfile /></AppLayout>,
      },
    ],
  },
]);

export default routes;