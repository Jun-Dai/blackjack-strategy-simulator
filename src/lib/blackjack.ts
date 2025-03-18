
// Card suit and rank types
export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

// Card model
export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
  isFaceUp: boolean;
}

// Player hand
export interface Hand {
  cards: Card[];
  value: number;
  isSoft: boolean;
  isBusted: boolean;
  isBlackjack: boolean;
  isPair: boolean;
  hasAce: boolean;
  bet: number;
  result?: "win" | "lose" | "push" | "blackjack";
  payout?: number;
}

// Dealer hand
export interface DealerHand {
  cards: Card[];
  value: number;
  isSoft: boolean;
  isBusted: boolean;
  isBlackjack: boolean;
  upCardValue: number;
}

// Game rules
export interface BlackjackRules {
  decks: number;
  blackjackPayout: number;
  dealerStandsOnSoft17: boolean;
  doubleAfterSplit: boolean;
  hitSplitAces: boolean;
  surrenderAllowed: boolean;
  maxSplitHands: number;
  minimumBet: number;
  maximumBet: number;
}

// Decision types
export type Decision = "hit" | "stand" | "double" | "split" | "surrender";

// Player strategy for different scenarios
export interface PlayerStrategy {
  hardTotals: Record<string, Record<string, Decision>>;
  softTotals: Record<string, Record<string, Decision>>;
  pairs: Record<string, Record<string, Decision>>;
}

// Simulation results
export interface SimulationResult {
  handsPlayed: number;
  handsWon: number;
  handsLost: number;
  handsPushed: number;
  blackjacks: number;
  busts: number;
  totalBet: number;
  totalWinnings: number;
  netProfit: number;
  houseEdge: number;
  winRate: number;
}

// Card value calculation
export const getCardValue = (rank: Rank): number => {
  if (rank === "A") return 11;
  if (["K", "Q", "J"].includes(rank)) return 10;
  return parseInt(rank, 10);
};

// Hand value calculation
export const calculateHandValue = (cards: Card[]): { value: number; isSoft: boolean } => {
  let value = 0;
  let aceCount = 0;
  
  // Sum all cards
  for (const card of cards) {
    if (card.rank === "A") {
      aceCount++;
    }
    value += card.value;
  }
  
  // Adjust for aces if needed
  let isSoft = false;
  while (value > 21 && aceCount > 0) {
    value -= 10; // Convert Ace from 11 to 1
    aceCount--;
  }
  
  // Hand is soft if it contains an Ace counted as 11
  isSoft = aceCount > 0 && value <= 21;
  
  return { value, isSoft };
};

// Create a new deck of cards
export const createDeck = (): Card[] => {
  const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
  const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        value: getCardValue(rank),
        isFaceUp: true
      });
    }
  }
  
  return deck;
};

// Shuffle an array using Fisher-Yates algorithm
export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Default strategy
export const defaultStrategy: PlayerStrategy = {
  hardTotals: {
    "8": { "2": "hit", "3": "hit", "4": "hit", "5": "hit", "6": "hit", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "9": { "2": "hit", "3": "double", "4": "double", "5": "double", "6": "double", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "10": { "2": "double", "3": "double", "4": "double", "5": "double", "6": "double", "7": "double", "8": "double", "9": "double", "10": "hit", "A": "hit" },
    "11": { "2": "double", "3": "double", "4": "double", "5": "double", "6": "double", "7": "double", "8": "double", "9": "double", "10": "double", "A": "hit" },
    "12": { "2": "hit", "3": "hit", "4": "stand", "5": "stand", "6": "stand", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "13": { "2": "stand", "3": "stand", "4": "stand", "5": "stand", "6": "stand", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "14": { "2": "stand", "3": "stand", "4": "stand", "5": "stand", "6": "stand", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "15": { "2": "stand", "3": "stand", "4": "stand", "5": "stand", "6": "stand", "7": "hit", "8": "hit", "9": "hit", "10": "surrender", "A": "hit" },
    "16": { "2": "stand", "3": "stand", "4": "stand", "5": "stand", "6": "stand", "7": "hit", "8": "hit", "9": "surrender", "10": "surrender", "A": "surrender" },
    "17": { "2": "stand", "3": "stand", "4": "stand", "5": "stand", "6": "stand", "7": "stand", "8": "stand", "9": "stand", "10": "stand", "A": "stand" }
  },
  softTotals: {
    "13": { "2": "hit", "3": "hit", "4": "hit", "5": "double", "6": "double", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "14": { "2": "hit", "3": "hit", "4": "hit", "5": "double", "6": "double", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "15": { "2": "hit", "3": "hit", "4": "double", "5": "double", "6": "double", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "16": { "2": "hit", "3": "hit", "4": "double", "5": "double", "6": "double", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "17": { "2": "hit", "3": "double", "4": "double", "5": "double", "6": "double", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "18": { "2": "stand", "3": "double", "4": "double", "5": "double", "6": "double", "7": "stand", "8": "stand", "9": "hit", "10": "hit", "A": "hit" },
    "19": { "2": "stand", "3": "stand", "4": "stand", "5": "stand", "6": "stand", "7": "stand", "8": "stand", "9": "stand", "10": "stand", "A": "stand" },
    "20": { "2": "stand", "3": "stand", "4": "stand", "5": "stand", "6": "stand", "7": "stand", "8": "stand", "9": "stand", "10": "stand", "A": "stand" }
  },
  pairs: {
    "2": { "2": "split", "3": "split", "4": "split", "5": "split", "6": "split", "7": "split", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "3": { "2": "split", "3": "split", "4": "split", "5": "split", "6": "split", "7": "split", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "4": { "2": "hit", "3": "hit", "4": "hit", "5": "split", "6": "split", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "5": { "2": "double", "3": "double", "4": "double", "5": "double", "6": "double", "7": "double", "8": "double", "9": "double", "10": "hit", "A": "hit" },
    "6": { "2": "split", "3": "split", "4": "split", "5": "split", "6": "split", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "7": { "2": "split", "3": "split", "4": "split", "5": "split", "6": "split", "7": "split", "8": "hit", "9": "hit", "10": "hit", "A": "hit" },
    "8": { "2": "split", "3": "split", "4": "split", "5": "split", "6": "split", "7": "split", "8": "split", "9": "split", "10": "split", "A": "split" },
    "9": { "2": "split", "3": "split", "4": "split", "5": "split", "6": "split", "7": "stand", "8": "split", "9": "split", "10": "stand", "A": "stand" },
    "10": { "2": "stand", "3": "stand", "4": "stand", "5": "stand", "6": "stand", "7": "stand", "8": "stand", "9": "stand", "10": "stand", "A": "stand" },
    "A": { "2": "split", "3": "split", "4": "split", "5": "split", "6": "split", "7": "split", "8": "split", "9": "split", "10": "split", "A": "split" }
  }
};

// Default rules
export const defaultRules: BlackjackRules = {
  decks: 6,
  blackjackPayout: 1.5,
  dealerStandsOnSoft17: true,
  doubleAfterSplit: true,
  hitSplitAces: false,
  surrenderAllowed: true,
  maxSplitHands: 4,
  minimumBet: 10,
  maximumBet: 1000
};
