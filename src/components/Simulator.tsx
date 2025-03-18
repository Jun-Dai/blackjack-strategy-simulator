
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BlackjackRulesConfig from "./BlackjackRulesConfig";
import StrategyEditor from "./StrategyEditor";
import SimulationResults from "./SimulationResults";
import StrategyManager from "./StrategyManager";
import { BlackjackRules, PlayerStrategy, SimulationResult, defaultRules, defaultStrategy } from "@/lib/blackjack";
import { BlackjackSimulator } from "@/lib/simulator";
import { toast } from "sonner";
import { Play, Settings, Loader2, ArrowLeftRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Simulator: React.FC = () => {
  const [rules, setRules] = useState<BlackjackRules>(defaultRules);
  const [strategyA, setStrategyA] = useState<PlayerStrategy>(defaultStrategy);
  const [strategyB, setStrategyB] = useState<PlayerStrategy>(defaultStrategy);
  const [activeStrategy, setActiveStrategy] = useState<"A" | "B">("A");
  const [compareMode, setCompareMode] = useState(false);
  const [resultsA, setResultsA] = useState<SimulationResult | null>(null);
  const [resultsB, setResultsB] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [iterations, setIterations] = useState(1000);

  const runSimulation = () => {
    setIsSimulating(true);
    
    if (compareMode) {
      setResultsA(null);
      setResultsB(null);
    } else {
      if (activeStrategy === "A") {
        setResultsA(null);
      } else {
        setResultsB(null);
      }
    }
    
    // Using setTimeout to allow the UI to update and show loading state
    setTimeout(() => {
      try {
        if (compareMode) {
          // Run both strategies
          const simulatorA = new BlackjackSimulator(rules, strategyA);
          const simulationResultsA = simulatorA.runSimulation(iterations);
          setResultsA(simulationResultsA);

          const simulatorB = new BlackjackSimulator(rules, strategyB);
          const simulationResultsB = simulatorB.runSimulation(iterations);
          setResultsB(simulationResultsB);
          
          toast.success(`Comparison completed with ${iterations.toLocaleString()} hands for each strategy`);
        } else {
          // Run single strategy
          const activeStrategyData = activeStrategy === "A" ? strategyA : strategyB;
          const simulator = new BlackjackSimulator(rules, activeStrategyData);
          const simulationResults = simulator.runSimulation(iterations);
          
          if (activeStrategy === "A") {
            setResultsA(simulationResults);
          } else {
            setResultsB(simulationResults);
          }
          
          toast.success(`Simulation completed with ${iterations.toLocaleString()} hands`);
        }
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
              
              <div className="flex items-center gap-2">
                <Button 
                  variant={compareMode ? "outline" : "default"}
                  size="sm"
                  onClick={() => setCompareMode(false)}
                  disabled={isSimulating}
                >
                  Single Mode
                </Button>
                <Button 
                  variant={compareMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCompareMode(true)}
                  disabled={isSimulating}
                  className="flex items-center gap-1"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  Compare Mode
                </Button>
              </div>
            </div>

            {!compareMode && (
              <Tabs defaultValue="A" value={activeStrategy} onValueChange={(value) => setActiveStrategy(value as "A" | "B")} className="mb-4">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="A">Strategy A</TabsTrigger>
                  <TabsTrigger value="B">Strategy B</TabsTrigger>
                </TabsList>
                <TabsContent value="A" className="mt-2">
                  <StrategyManager
                    currentStrategy={strategyA}
                    onStrategyLoad={setStrategyA}
                  />
                </TabsContent>
                <TabsContent value="B" className="mt-2">
                  <StrategyManager
                    currentStrategy={strategyB}
                    onStrategyLoad={setStrategyB}
                  />
                </TabsContent>
              </Tabs>
            )}

            {compareMode && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Strategy A</h4>
                  <StrategyManager
                    currentStrategy={strategyA}
                    onStrategyLoad={setStrategyA}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Strategy B</h4>
                  <StrategyManager
                    currentStrategy={strategyB}
                    onStrategyLoad={setStrategyB}
                  />
                </div>
              </div>
            )}
            
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
                  {compareMode ? "Comparing Strategies..." : "Simulating..."}
                </>
              ) : (
                compareMode ? "Compare Strategies" : "Run Simulation"
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <SimulationResults 
            resultsA={resultsA} 
            resultsB={resultsB} 
            compareMode={compareMode}
            isLoading={isSimulating} 
          />
        </div>
      </div>
      
      <div className="mt-6">
        <Tabs defaultValue={activeStrategy === "A" ? "strategyA" : "strategyB"}>
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="strategyA">Edit Strategy A</TabsTrigger>
            <TabsTrigger value="strategyB">Edit Strategy B</TabsTrigger>
          </TabsList>
          <TabsContent value="strategyA" className="mt-2">
            <StrategyEditor strategy={strategyA} onStrategyChange={setStrategyA} />
          </TabsContent>
          <TabsContent value="strategyB" className="mt-2">
            <StrategyEditor strategy={strategyB} onStrategyChange={setStrategyB} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Simulator;
