import { createBrowserRouter, Navigate } from "react-router-dom";
import Auth from "../pages/Auth/Auth";
import Home from "../pages/Home/Home";
import ForgotPassword from "../pages/components/ForgotPassword";
import { isAuthenticated } from "./isAuthenticated";
import { JSX } from "react";

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    return isAuthenticated() ? element : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Auth />,
    },
    {
        path: "/home",
        element: <PrivateRoute element={<Home />} />,
    },
    {
        path: "/auth/forgot-password",
        element: <ForgotPassword />,
    },
]);

export default router;
