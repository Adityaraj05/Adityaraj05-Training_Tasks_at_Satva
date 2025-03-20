import { RouteObject, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Products } from "../pages/Products";
import { Users } from "../pages/Users";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/register" replace />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Layout /></ProtectedRoute>, 
    children: [
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "users",
        element: <Users />,
      },
      
    ],
  },
];
