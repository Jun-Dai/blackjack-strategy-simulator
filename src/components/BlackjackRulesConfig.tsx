
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlackjackRules } from "@/lib/blackjack";
import { ChevronDown, Settings } from "lucide-react";

interface BlackjackRulesConfigProps {
  rules: BlackjackRules;
  onRulesChange: (rules: BlackjackRules) => void;
}

const BlackjackRulesConfig: React.FC<BlackjackRulesConfigProps> = ({ rules, onRulesChange }) => {
  const handleRuleChange = <K extends keyof BlackjackRules>(
    key: K,
    value: BlackjackRules[K]
  ) => {
    const updatedRules = { ...rules, [key]: value };
    onRulesChange(updatedRules);
  };

  const blackjackPayouts = [
    { label: "3:2 (1.5x)", value: 1.5 },
    { label: "6:5 (1.2x)", value: 1.2 },
    { label: "1:1 (Even Money)", value: 1 },
  ];

  return (
    <Card className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Settings className="h-5 w-5 mr-2 text-primary/80" />
          <span>Game Rules</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="decks" className="text-sm font-medium">
            Number of Decks
          </Label>
          <div className="flex items-center gap-2">
            <Slider 
              id="decks"
              min={1} 
              max={8} 
              step={1}
              value={[rules.decks]}
              onValueChange={(value) => handleRuleChange("decks", value[0])}
              className="flex-grow"
            />
            <span className="w-8 text-center font-mono">{rules.decks}</span>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="blackjackPayout" className="text-sm font-medium">
            Blackjack Payout
          </Label>
          <Select 
            value={rules.blackjackPayout.toString()} 
            onValueChange={(value) => handleRuleChange("blackjackPayout", parseFloat(value))}
          >
            <SelectTrigger id="blackjackPayout" className="w-full">
              <SelectValue placeholder="Select payout ratio" />
            </SelectTrigger>
            <SelectContent>
              {blackjackPayouts.map((payout) => (
                <SelectItem key={payout.value} value={payout.value.toString()}>
                  {payout.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="dealerStandsOnSoft17" className="text-sm font-medium cursor-pointer">
            Dealer stands on soft 17
          </Label>
          <Switch 
            id="dealerStandsOnSoft17"
            checked={rules.dealerStandsOnSoft17}
            onCheckedChange={(checked) => handleRuleChange("dealerStandsOnSoft17", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="doubleAfterSplit" className="text-sm font-medium cursor-pointer">
            Double after split
          </Label>
          <Switch 
            id="doubleAfterSplit"
            checked={rules.doubleAfterSplit}
            onCheckedChange={(checked) => handleRuleChange("doubleAfterSplit", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="hitSplitAces" className="text-sm font-medium cursor-pointer">
            Hit split aces
          </Label>
          <Switch 
            id="hitSplitAces"
            checked={rules.hitSplitAces}
            onCheckedChange={(checked) => handleRuleChange("hitSplitAces", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="surrenderAllowed" className="text-sm font-medium cursor-pointer">
            Surrender allowed
          </Label>
          <Switch 
            id="surrenderAllowed"
            checked={rules.surrenderAllowed}
            onCheckedChange={(checked) => handleRuleChange("surrenderAllowed", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlackjackRulesConfig;
