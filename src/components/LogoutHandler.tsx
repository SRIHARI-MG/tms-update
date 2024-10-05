// src/components/LogoutHandler.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login"); // Redirect to login
    };

    window.addEventListener("logout", handleLogout); // Listen for logout events

    return () => {
      window.removeEventListener("logout", handleLogout); // Cleanup listener on unmount
    };
  }, [navigate]);

  return null; // This component does not render anything
};

export default LogoutHandler;
