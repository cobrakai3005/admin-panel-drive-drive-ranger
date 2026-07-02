import React from "react";
import { useAuthProvider } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useAuthProvider();
  if(!user){
    return <Navigate to={"/auth"}/>
  }
  return children;
}
