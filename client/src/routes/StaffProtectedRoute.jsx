import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const StaffsProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (user && (user.role === "lecturer" || user.role === "HOD")) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

export default StaffsProtectedRoute;
