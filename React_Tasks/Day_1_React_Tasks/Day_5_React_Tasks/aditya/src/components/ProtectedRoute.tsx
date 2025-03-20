import { Navigate } from "react-router-dom";
import React from "react";
import { getUserFromToken } from "../utils/auth";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getUserFromToken();
      setIsAuthenticated(!!user);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return null; // Wait until verification is done
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
