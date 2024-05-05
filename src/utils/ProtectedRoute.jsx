import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("user-ma-token");
    if (!token) {
      setIsLoggedIn(false);
      return navigate("/login");
    } else {
      try {
        const decode = jwtDecode(token);
        if (decode.exp * 1000 < Date.now()) {
          localStorage.clear();
          return navigate("/login");
        }
      } catch (error) {
        localStorage.clear();
        return navigate("/login");
      }
      setIsLoggedIn(true);
    }
  }, [isLoggedin, navigate]);

  return <>{isLoggedin ? children : null}</>;
};

export default ProtectedRoute;
