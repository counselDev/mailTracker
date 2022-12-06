import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const StudentsProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (user && user.role === "student") {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

export default StudentsProtectedRoute;
