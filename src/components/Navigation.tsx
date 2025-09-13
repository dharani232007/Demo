import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hospital, UserCheck, LogIn, Home } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="border-b bg-card shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Hospital className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SmartQueue
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button
              variant={location.pathname === "/register" ? "default" : "ghost"}
              asChild
            >
              <Link to="/register">
                <Hospital className="h-4 w-4 mr-2" />
                Register Hospital
              </Link>
            </Button>
            
            <Button
              variant={location.pathname === "/admin-login" ? "default" : "ghost"}
              asChild
            >
              <Link to="/admin-login">
                <LogIn className="h-4 w-4 mr-2" />
                Admin Login
              </Link>
            </Button>
            
            <Button
              variant={location.pathname === "/join-queue" ? "secondary" : "outline"}
              asChild
            >
              <Link to="/join-queue">
                <UserCheck className="h-4 w-4 mr-2" />
                Join Queue
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
