import React from "react";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (userRole != "User") return <Navigate to="/" />;
  return children;
};

export default UserRoute;