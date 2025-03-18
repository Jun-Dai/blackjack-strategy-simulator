
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayerStrategy, Decision } from "@/lib/blackjack";
import { ChevronDown, FileEdit } from "lucide-react";

interface StrategyEditorProps {
  strategy: PlayerStrategy;
  onStrategyChange: (strategy: PlayerStrategy) => void;
}

type HandType = "hardTotals" | "softTotals" | "pairs";

const StrategyEditor: React.FC<StrategyEditorProps> = ({ strategy, onStrategyChange }) => {
  const [activeTab, setActiveTab] = useState<HandType>("hardTotals");

  const decisions: { value: Decision; label: string }[] = [
    { value: "hit", label: "Hit" },
    { value: "stand", label: "Stand" },
    { value: "double", label: "Double" },
    { value: "split", label: "Split" },
    { value: "surrender", label: "Surrender" },
  ];

  const dealerCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"];
  
  const handTotals = {
    hardTotals: ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17"],
    softTotals: ["13", "14", "15", "16", "17", "18", "19", "20"],
    pairs: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"],
  };

  const titles = {
    hardTotals: "Hard Totals",
    softTotals: "Soft Totals (with Ace)",
    pairs: "Pairs",
  };

  const handleDecisionChange = (
    handType: HandType,
    handValue: string,
    dealerCard: string,
    decision: Decision
  ) => {
    const updatedStrategy = { ...strategy };
    if (!updatedStrategy[handType][handValue]) {
      updatedStrategy[handType][handValue] = {};
    }
    updatedStrategy[handType][handValue][dealerCard] = decision;
    onStrategyChange(updatedStrategy);
  };

  const getDecisionColor = (decision: Decision) => {
    switch (decision) {
      case "hit":
        return "bg-red-100 text-red-800";
      case "stand":
        return "bg-green-100 text-green-800";
      case "double":
        return "bg-blue-100 text-blue-800";
      case "split":
        return "bg-purple-100 text-purple-800";
      case "surrender":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTabLabel = (handType: HandType) => {
    switch (handType) {
      case "hardTotals":
        return "Hard Totals";
      case "softTotals":
        return "Soft Totals";
      case "pairs":
        return "Pairs";
    }
  };

  return (
    <Card className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <FileEdit className="h-5 w-5 mr-2 text-primary/80" />
          <span>Strategy Editor</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hardTotals" value={activeTab} onValueChange={(value) => setActiveTab(value as HandType)}>
          <TabsList className="grid grid-cols-3 mb-4">
            {(Object.keys(handTotals) as HandType[]).map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-sm">
                {getTabLabel(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {(Object.keys(handTotals) as HandType[]).map((handType) => (
            <TabsContent key={handType} value={handType} className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead>
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500">
                        {handType === "hardTotals" ? "Total" : handType === "softTotals" ? "Soft Total" : "Pair"}
                      </th>
                      {dealerCards.map((card) => (
                        <th key={card} className="px-2 py-2 text-center text-xs font-semibold text-gray-500">
                          {card}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {handTotals[handType].map((handValue) => (
                      <tr key={handValue} className="border-t border-gray-200">
                        <td className="px-2 py-2 text-left font-medium">{handValue}</td>
                        {dealerCards.map((dealerCard) => {
                          const currentDecision = strategy[handType][handValue]?.[dealerCard] || "hit";
                          
                          return (
                            <td key={dealerCard} className="px-1 py-1 text-center">
                              <Select
                                value={currentDecision}
                                onValueChange={(value) => 
                                  handleDecisionChange(handType, handValue, dealerCard, value as Decision)
                                }
                              >
                                <SelectTrigger 
                                  className={`h-8 w-20 text-xs ${getDecisionColor(currentDecision)}`}
                                >
                                  <SelectValue placeholder="Action" />
                                </SelectTrigger>
                                <SelectContent>
                                  {decisions.map((d) => (
                                    <SelectItem key={d.value} value={d.value}>
                                      {d.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StrategyEditor;
