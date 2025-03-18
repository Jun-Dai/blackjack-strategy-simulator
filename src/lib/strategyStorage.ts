
import { PlayerStrategy } from "./blackjack";

// Type for saved strategy metadata
export interface SavedStrategy {
  id: string;
  name: string;
  createdAt: string;
  strategy: PlayerStrategy;
}

const STORAGE_KEY = "blackjack-strategies";

// Get all saved strategies
export const getSavedStrategies = (): SavedStrategy[] => {
  try {
    const savedStrategies = localStorage.getItem(STORAGE_KEY);
    return savedStrategies ? JSON.parse(savedStrategies) : [];
  } catch (error) {
    console.error("Error loading strategies from storage:", error);
    return [];
  }
};

// Save a new strategy
export const saveStrategy = (name: string, strategy: PlayerStrategy): SavedStrategy => {
  const strategies = getSavedStrategies();
  
  // Create a new strategy object
  const newStrategy: SavedStrategy = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    strategy,
  };
  
  // Add to list and save
  strategies.push(newStrategy);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(strategies));
  
  return newStrategy;
};

// Load a strategy by ID
export const loadStrategyById = (id: string): PlayerStrategy | null => {
  const strategies = getSavedStrategies();
  const strategy = strategies.find(s => s.id === id);
  return strategy ? strategy.strategy : null;
};

// Delete a strategy by ID
export const deleteStrategyById = (id: string): void => {
  const strategies = getSavedStrategies();
  const filteredStrategies = strategies.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredStrategies));
};
