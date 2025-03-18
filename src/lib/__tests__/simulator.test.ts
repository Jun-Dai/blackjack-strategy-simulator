
import { BlackjackSimulator } from '../simulator';
import { 
  defaultRules, 
  defaultStrategy,
  PlayerStrategy,
  BlackjackRules,
  Suit,
  Rank
} from '../blackjack';

describe('BlackjackSimulator', () => {
  let simulator: BlackjackSimulator;
  let rules: BlackjackRules;
  let strategy: PlayerStrategy;

  beforeEach(() => {
    rules = { ...defaultRules };
    strategy = JSON.parse(JSON.stringify(defaultStrategy)); // Deep copy
    simulator = new BlackjackSimulator(rules, strategy);
  });

  describe('initialization', () => {
    it('should create a new simulator instance with provided rules and strategy', () => {
      expect(simulator).toBeInstanceOf(BlackjackSimulator);
    });
  });

  describe('simulateHand', () => {
    it('should return player and dealer hands after simulation', () => {
      const { playerHand, dealerHand } = simulator.simulateHand();
      
      expect(playerHand).toBeDefined();
      expect(dealerHand).toBeDefined();
      expect(playerHand.cards.length).toBeGreaterThanOrEqual(2);
      expect(dealerHand.cards.length).toBeGreaterThanOrEqual(2);
    });

    it('should assign a result to the player hand', () => {
      const { playerHand } = simulator.simulateHand();
      
      expect(['win', 'lose', 'push', 'blackjack']).toContain(playerHand.result);
    });

    it('should update internal statistics', () => {
      simulator.simulateHand();
      const results = simulator.runSimulation(1); // Just to access current results
      
      expect(results.handsPlayed).toBe(2); // 1 from simulateHand + 1 from runSimulation
    });
  });

  describe('runSimulation', () => {
    it('should run the specified number of hands', () => {
      const iterations = 10;
      const results = simulator.runSimulation(iterations);
      
      expect(results.handsPlayed).toBe(iterations);
    });

    it('should calculate statistics correctly', () => {
      const iterations = 100;
      const results = simulator.runSimulation(iterations);
      
      expect(results.handsWon + results.handsLost + results.handsPushed).toBe(iterations);
      expect(results.blackjacks).toBeLessThanOrEqual(results.handsWon);
      expect(results.busts).toBeLessThanOrEqual(results.handsLost);
    });

    it('should calculate win rate correctly', () => {
      const iterations = 100;
      const results = simulator.runSimulation(iterations);
      
      const expectedWinRate = (results.handsWon / results.handsPlayed) * 100;
      expect(results.winRate).toBeCloseTo(expectedWinRate);
    });

    it('should calculate house edge correctly', () => {
      const iterations = 100;
      const results = simulator.runSimulation(iterations);
      
      const expectedHouseEdge = (results.totalBet - results.totalWinnings) / results.totalBet * 100;
      expect(results.houseEdge).toBeCloseTo(expectedHouseEdge);
    });
  });

  describe('strategy implementation', () => {
    it('should follow the hit strategy correctly', () => {
      // Force a specific strategy for testing
      strategy.hardTotals = {
        "16": { "2": "hit", "3": "hit", "4": "hit", "5": "hit", "6": "hit", "7": "hit", "8": "hit", "9": "hit", "10": "hit", "A": "hit" }
      };
      
      simulator = new BlackjackSimulator(rules, strategy);
      
      // Seed the test by forcing a specific initial hand through monkey patching
      const originalDealInitialHands = (simulator as any).dealInitialHands;
      (simulator as any).dealInitialHands = jest.fn().mockImplementation(() => {
        return {
          playerHand: {
            cards: [
              { suit: 'hearts' as Suit, rank: '10' as Rank, value: 10, isFaceUp: true },
              { suit: 'clubs' as Suit, rank: '6' as Rank, value: 6, isFaceUp: true }
            ],
            value: 16,
            isSoft: false,
            isBusted: false,
            isBlackjack: false,
            isPair: false,
            hasAce: false,
            bet: rules.minimumBet
          },
          dealerHand: {
            cards: [
              { suit: 'diamonds' as Suit, rank: 'K' as Rank, value: 10, isFaceUp: false },
              { suit: 'spades' as Suit, rank: '7' as Rank, value: 7, isFaceUp: true }
            ],
            value: 0,
            isSoft: false,
            isBusted: false,
            isBlackjack: false,
            upCardValue: 7
          }
        };
      });
      
      // Since our strategy is always "hit" for hand value 16, player should draw at least one more card
      const { playerHand } = simulator.simulateHand();
      
      expect(playerHand.cards.length).toBeGreaterThan(2);
      
      // Restore original method
      (simulator as any).dealInitialHands = originalDealInitialHands;
    });
  });
});
