
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationResult } from "@/lib/blackjack";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChartIcon, BarChart3, LineChart as LineChartIcon, ArrowRight, ArrowLeft } from "lucide-react";

interface SimulationResultsProps {
  resultsA: SimulationResult | null;
  resultsB: SimulationResult | null;
  compareMode: boolean;
  isLoading: boolean;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ resultsA, resultsB, compareMode, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 bg-primary/20 rounded-full mb-4"></div>
            <div className="h-4 w-40 bg-primary/20 rounded mb-2"></div>
            <div className="h-4 w-32 bg-primary/20 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const hasResults = compareMode ? (resultsA && resultsB) : (resultsA || resultsB);

  if (!hasResults) {
    return (
      <Card className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm h-[500px] flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">No Simulation Data</h3>
          <p className="text-muted-foreground">
            Configure your strategy and run a simulation to see results.
          </p>
        </div>
      </Card>
    );
  }

  // For compare mode, we show comparison data
  if (compareMode && resultsA && resultsB) {
    return <ComparisonView resultsA={resultsA} resultsB={resultsB} />;
  }

  // For single mode, show either resultsA or resultsB
  const results = resultsA || resultsB;
  if (!results) return null;
  
  return <SingleResultView results={results} />;
};

// Component for single strategy results view
const SingleResultView: React.FC<{ results: SimulationResult }> = ({ results }) => {
  const outcomeData = [
    { name: "Wins", value: results.handsWon, color: "#10b981" },
    { name: "Losses", value: results.handsLost, color: "#ef4444" },
    { name: "Pushes", value: results.handsPushed, color: "#6b7280" },
  ];

  const statsData = [
    { name: "Hands Played", value: results.handsPlayed },
    { name: "Win Rate", value: results.winRate.toFixed(2) + "%" },
    { name: "Blackjacks", value: results.blackjacks },
    { name: "Busts", value: results.busts },
    { name: "Net Profit", value: "$" + results.netProfit.toFixed(2) },
    { name: "House Edge", value: results.houseEdge.toFixed(2) + "%" },
  ];

  const COLORS = ["#10b981", "#ef4444", "#6b7280"];

  return (
    <Card className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Simulation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary" className="text-sm flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Summary</span>
            </TabsTrigger>
            <TabsTrigger value="chart" className="text-sm flex items-center gap-1">
              <PieChartIcon className="h-3.5 w-3.5" />
              <span>Outcomes</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="text-sm flex items-center gap-1">
              <LineChartIcon className="h-3.5 w-3.5" />
              <span>Statistics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-0">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {statsData.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white/70 p-4 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
                >
                  <h4 className="text-sm font-medium text-gray-500">{item.name}</h4>
                  <p className="text-2xl font-bold mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="chart" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                    labelLine={false}
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-0">
            <div className="space-y-4">
              <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Profit Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Bet</p>
                    <p className="text-lg font-semibold">${results.totalBet.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Winnings</p>
                    <p className="text-lg font-semibold">${results.totalWinnings.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Net Profit</p>
                    <p className={`text-lg font-semibold ${results.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${results.netProfit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">House Edge</p>
                    <p className="text-lg font-semibold">{results.houseEdge.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Win Rate</p>
                    <p className="text-lg font-semibold">{results.winRate.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blackjack Rate</p>
                    <p className="text-lg font-semibold">
                      {((results.blackjacks / results.handsPlayed) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bust Rate</p>
                    <p className="text-lg font-semibold">
                      {((results.busts / results.handsPlayed) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Component for comparison view between two strategies
const ComparisonView: React.FC<{ resultsA: SimulationResult; resultsB: SimulationResult }> = ({ 
  resultsA, 
  resultsB 
}) => {
  const comparisonData = [
    { 
      name: "Win Rate", 
      valueA: resultsA.winRate.toFixed(2), 
      valueB: resultsB.winRate.toFixed(2),
      unit: "%",
      diff: (resultsA.winRate - resultsB.winRate).toFixed(2),
      better: resultsA.winRate > resultsB.winRate ? "A" : "B"
    },
    { 
      name: "House Edge", 
      valueA: resultsA.houseEdge.toFixed(2), 
      valueB: resultsB.houseEdge.toFixed(2),
      unit: "%",
      diff: (resultsA.houseEdge - resultsB.houseEdge).toFixed(2),
      better: resultsA.houseEdge < resultsB.houseEdge ? "A" : "B"
    },
    { 
      name: "Net Profit", 
      valueA: resultsA.netProfit.toFixed(2), 
      valueB: resultsB.netProfit.toFixed(2),
      unit: "$",
      diff: (resultsA.netProfit - resultsB.netProfit).toFixed(2),
      better: resultsA.netProfit > resultsB.netProfit ? "A" : "B"
    },
    { 
      name: "Blackjack Rate", 
      valueA: ((resultsA.blackjacks / resultsA.handsPlayed) * 100).toFixed(2), 
      valueB: ((resultsB.blackjacks / resultsB.handsPlayed) * 100).toFixed(2),
      unit: "%",
      diff: (((resultsA.blackjacks / resultsA.handsPlayed) * 100) - ((resultsB.blackjacks / resultsB.handsPlayed) * 100)).toFixed(2),
      better: (resultsA.blackjacks / resultsA.handsPlayed) > (resultsB.blackjacks / resultsB.handsPlayed) ? "A" : "B"
    },
    { 
      name: "Bust Rate", 
      valueA: ((resultsA.busts / resultsA.handsPlayed) * 100).toFixed(2), 
      valueB: ((resultsB.busts / resultsB.handsPlayed) * 100).toFixed(2),
      unit: "%",
      diff: (((resultsA.busts / resultsA.handsPlayed) * 100) - ((resultsB.busts / resultsB.handsPlayed) * 100)).toFixed(2),
      better: (resultsA.busts / resultsA.handsPlayed) < (resultsB.busts / resultsB.handsPlayed) ? "A" : "B"
    }
  ];

  const chartData = [
    { name: "Wins", A: resultsA.handsWon, B: resultsB.handsWon },
    { name: "Losses", A: resultsA.handsLost, B: resultsB.handsLost },
    { name: "Pushes", A: resultsA.handsPushed, B: resultsB.handsPushed },
    { name: "Blackjacks", A: resultsA.blackjacks, B: resultsB.blackjacks },
    { name: "Busts", A: resultsA.busts, B: resultsB.busts }
  ];

  return (
    <Card className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Comparison Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comparison">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="comparison" className="text-sm flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Key Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="chart" className="text-sm flex items-center gap-1">
              <PieChartIcon className="h-3.5 w-3.5" />
              <span>Chart Comparison</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparison" className="mt-0">
            <div className="space-y-4">
              {comparisonData.map((item, index) => (
                <div key={index} className="bg-white/70 p-4 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{item.name}</h4>
                  <div className="grid grid-cols-5 items-center">
                    <div className="col-span-2 text-center">
                      <div className="text-sm text-gray-500">Strategy A</div>
                      <div className="text-xl font-semibold">{item.unit}{item.valueA}</div>
                    </div>
                    
                    <div className="flex justify-center items-center">
                      {item.better === "A" ? (
                        <div className="flex items-center text-green-600">
                          <ArrowLeft className="h-4 w-4" />
                          <span className="text-xs font-medium ml-1">{Math.abs(parseFloat(item.diff as string)).toFixed(2)}{item.unit}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600">
                          <span className="text-xs font-medium mr-1">{Math.abs(parseFloat(item.diff as string)).toFixed(2)}{item.unit}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <div className="text-sm text-gray-500">Strategy B</div>
                      <div className="text-xl font-semibold">{item.unit}{item.valueB}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="chart" className="mt-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="A" fill="#3b82f6" name="Strategy A" />
                  <Bar dataKey="B" fill="#f97316" name="Strategy B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SimulationResults;
