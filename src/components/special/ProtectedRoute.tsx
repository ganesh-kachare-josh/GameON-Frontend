import { authApi } from "@/lib/api";
import Cookies from "js-cookie";
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
interface ProtectedRouteProps {
  children: ReactNode;
}


export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (!Cookies.get("token")) {
          setIsAuthenticated(false);
        }
        const { data } = await authApi.isLoggedIn();
        setIsAuthenticated(data.is_login);
        setAuthChecked(true);
      } catch (error) {
        console.error("Failed to check authentication status:", error);
        setIsAuthenticated(false);
        setAuthChecked(true);
      }
    };

    checkAuthStatus();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};