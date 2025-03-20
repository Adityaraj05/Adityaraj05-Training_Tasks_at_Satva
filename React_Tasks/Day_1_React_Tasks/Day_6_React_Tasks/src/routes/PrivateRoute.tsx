import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtVerify } from "jose";

const SECRET_KEY = "abcdefghjkl";

const verifyToken = async (token: string) => {
    try {
        const secret = new TextEncoder().encode(SECRET_KEY);
        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
};

const PrivateRoute = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    verifyToken(token).then((valid) => {
        if (!valid) {
            localStorage.removeItem("token");
            return <Navigate to="/" replace />;
        }
    });

    return <Outlet />;
};

export default PrivateRoute;
