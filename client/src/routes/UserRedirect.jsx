import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const UserRedirect = ({ children }) => {
  const { user } = useAppContext();
  if (user && (user.role === "lecturer" || user.role === "HOD")) {
    return <Navigate to="/lecturers" />;
  } else if (user && user.role === "student") {
    return <Navigate to="/students" />;
  } else if (user && user.role === "admin") {
    return <Navigate to="/admin" />;
  } else {
    return children;
  }
};

export default UserRedirect;
