
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home or login based on authentication status
    if (isAuthenticated()) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null; // No need to render anything as we're redirecting
};

export default Index;
