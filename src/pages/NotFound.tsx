
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full text-center bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm p-8 animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
            <FileQuestion className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">This page doesn't exist</p>
        <Button asChild className="w-full">
          <a href="/">Return to home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
