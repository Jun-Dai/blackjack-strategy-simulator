
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BlackjackRulesConfig from "./BlackjackRulesConfig";
import StrategyEditor from "./StrategyEditor";
import SimulationResults from "./SimulationResults";
import StrategyManager from "./StrategyManager";
import { BlackjackRules, PlayerStrategy, SimulationResult, defaultRules, defaultStrategy } from "@/lib/blackjack";
import { BlackjackSimulator } from "@/lib/simulator";
import { toast } from "sonner";
import { Play, Settings, Loader2 } from "lucide-react";

const Simulator: React.FC = () => {
  const [rules, setRules] = useState<BlackjackRules>(defaultRules);
  const [strategy, setStrategy] = useState<PlayerStrategy>(defaultStrategy);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [iterations, setIterations] = useState(1000);

  const runSimulation = () => {
    setIsSimulating(true);
    setResults(null);
    
    // Using setTimeout to allow the UI to update and show loading state
    setTimeout(() => {
      try {
        const simulator = new BlackjackSimulator(rules, strategy);
        const simulationResults = simulator.runSimulation(iterations);
        setResults(simulationResults);
        toast.success(`Simulation completed with ${iterations.toLocaleString()} hands`);
      } catch (error) {
        console.error("Simulation error:", error);
        toast.error("An error occurred during simulation");
      } finally {
        setIsSimulating(false);
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <BlackjackRulesConfig rules={rules} onRulesChange={setRules} />
          
          <div className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Play className="h-5 w-5 mr-2 text-primary/80" />
                <h3 className="text-lg font-medium">Run Simulation</h3>
              </div>
              
              <StrategyManager
                currentStrategy={strategy}
                onStrategyLoad={setStrategy}
              />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-full">
                <label htmlFor="iterations" className="block text-sm font-medium mb-1">
                  Number of Hands
                </label>
                <select
                  id="iterations"
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value={100}>100 hands</option>
                  <option value={1000}>1,000 hands</option>
                  <option value={10000}>10,000 hands</option>
                  <option value={100000}>100,000 hands</option>
                </select>
              </div>
            </div>
            
            <Button 
              onClick={runSimulation} 
              disabled={isSimulating}
              className="w-full"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simulating...
                </>
              ) : (
                "Run Simulation"
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <SimulationResults results={results} isLoading={isSimulating} />
        </div>
      </div>
      
      <div className="mt-6">
        <StrategyEditor strategy={strategy} onStrategyChange={setStrategy} />
      </div>
    </div>
  );
};

export default Simulator;
