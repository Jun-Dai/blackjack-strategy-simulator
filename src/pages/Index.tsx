
import React from "react";
import Header from "@/components/Header";
import Simulator from "@/components/Simulator";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Blackjack Strategy Simulator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Define your blackjack strategy and test its performance through extensive simulations.
            Adjust the rules, refine your approach, and see how your strategy performs over thousands of hands.
          </p>
        </div>
        
        <Simulator />
      </main>
      
      <footer className="border-t bg-white/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with precision and care for card game enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
