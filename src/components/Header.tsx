
import React from "react";
import { GitBranch, Github } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-black text-white h-8 w-8 rounded-md flex items-center justify-center font-bold">♠</span>
            <span className="font-medium">Blackjack Strategy Simulator</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-1.5"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
