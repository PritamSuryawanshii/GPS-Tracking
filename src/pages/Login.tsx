
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { isAuthenticated } from "@/utils/auth";
import { MapPin } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-64 -top-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -right-64 -bottom-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="w-full max-w-lg z-10 animate-fade-in">
        <LoginForm />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            A stunning GPS tracking application with premium design
          </p>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>TrackMe &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
