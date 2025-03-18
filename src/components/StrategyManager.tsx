
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlayerStrategy } from "@/lib/blackjack";
import { getSavedStrategies, saveStrategy, loadStrategyById, deleteStrategyById, SavedStrategy } from "@/lib/strategyStorage";
import { Card, CardContent } from "@/components/ui/card";
import { Save, FolderOpen, Trash2, Download, Plus } from "lucide-react";
import { toast } from "sonner";

interface StrategyManagerProps {
  currentStrategy: PlayerStrategy;
  onStrategyLoad: (strategy: PlayerStrategy) => void;
}

const StrategyManager: React.FC<StrategyManagerProps> = ({ currentStrategy, onStrategyLoad }) => {
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [newStrategyName, setNewStrategyName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  
  // Load saved strategies from storage
  const loadSavedStrategies = () => {
    const strategies = getSavedStrategies();
    setSavedStrategies(strategies);
  };
  
  useEffect(() => {
    loadSavedStrategies();
  }, []);
  
  // Handle saving a new strategy
  const handleSaveStrategy = () => {
    if (!newStrategyName.trim()) {
      toast.error("Please enter a strategy name");
      return;
    }
    
    try {
      saveStrategy(newStrategyName, currentStrategy);
      toast.success(`Strategy "${newStrategyName}" saved successfully`);
      setNewStrategyName("");
      setSaveDialogOpen(false);
      loadSavedStrategies();
    } catch (error) {
      console.error("Error saving strategy:", error);
      toast.error("Failed to save strategy");
    }
  };
  
  // Handle loading a strategy
  const handleLoadStrategy = (strategyId: string) => {
    try {
      const strategy = loadStrategyById(strategyId);
      if (strategy) {
        onStrategyLoad(strategy);
        toast.success("Strategy loaded successfully");
        setLoadDialogOpen(false);
      } else {
        toast.error("Strategy not found");
      }
    } catch (error) {
      console.error("Error loading strategy:", error);
      toast.error("Failed to load strategy");
    }
  };
  
  // Handle deleting a strategy
  const handleDeleteStrategy = (strategyId: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the load action
    
    try {
      deleteStrategyById(strategyId);
      toast.success(`Strategy "${name}" deleted`);
      loadSavedStrategies();
    } catch (error) {
      console.error("Error deleting strategy:", error);
      toast.error("Failed to delete strategy");
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex space-x-2">
      {/* Save Strategy Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            <span>Save Strategy</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Strategy</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label htmlFor="strategyName" className="block text-sm font-medium mb-1">
                Strategy Name
              </label>
              <Input
                id="strategyName"
                value={newStrategyName}
                onChange={(e) => setNewStrategyName(e.target.value)}
                placeholder="Enter a name for your strategy"
              />
            </div>
            <Button onClick={handleSaveStrategy} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Strategy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Load Strategy Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <FolderOpen className="h-4 w-4" />
            <span>Load Strategy</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Load Strategy</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {savedStrategies.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No saved strategies found
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {savedStrategies.map((strategy) => (
                  <Card 
                    key={strategy.id} 
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleLoadStrategy(strategy.id)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">{strategy.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Created: {formatDate(strategy.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => handleDeleteStrategy(strategy.id, strategy.name, e)}
                          className="h-8 w-8 text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategyManager;
