
import { 
  getCardValue, 
  calculateHandValue, 
  createDeck, 
  shuffle,
  defaultStrategy,
  defaultRules,
  Card,
  Suit,
  Rank
} from '../blackjack';

describe('Blackjack Core Functions', () => {
  describe('getCardValue', () => {
    it('should return 11 for Ace', () => {
      expect(getCardValue('A')).toBe(11);
    });

    it('should return 10 for face cards (K, Q, J)', () => {
      expect(getCardValue('K')).toBe(10);
      expect(getCardValue('Q')).toBe(10);
      expect(getCardValue('J')).toBe(10);
    });

    it('should return correct value for number cards', () => {
      expect(getCardValue('2')).toBe(2);
      expect(getCardValue('7')).toBe(7);
      expect(getCardValue('10')).toBe(10);
    });
  });

  describe('calculateHandValue', () => {
    it('should calculate correct value for non-Ace cards', () => {
      const cards: Card[] = [
        { suit: 'hearts' as Suit, rank: '10' as Rank, value: 10, isFaceUp: true },
        { suit: 'clubs' as Suit, rank: '7' as Rank, value: 7, isFaceUp: true }
      ];
      
      const result = calculateHandValue(cards);
      
      expect(result.value).toBe(17);
      expect(result.isSoft).toBe(false);
    });

    it('should handle Ace as 11 when it doesn\'t bust (soft hand)', () => {
      const cards: Card[] = [
        { suit: 'hearts' as Suit, rank: 'A' as Rank, value: 11, isFaceUp: true },
        { suit: 'clubs' as Suit, rank: '7' as Rank, value: 7, isFaceUp: true }
      ];
      
      const result = calculateHandValue(cards);
      
      expect(result.value).toBe(18);
      expect(result.isSoft).toBe(true);
    });

    it('should convert Ace from 11 to 1 to prevent bust', () => {
      const cards: Card[] = [
        { suit: 'hearts' as Suit, rank: 'A' as Rank, value: 11, isFaceUp: true },
        { suit: 'clubs' as Suit, rank: '7' as Rank, value: 7, isFaceUp: true },
        { suit: 'diamonds' as Suit, rank: 'K' as Rank, value: 10, isFaceUp: true }
      ];
      
      const result = calculateHandValue(cards);
      
      expect(result.value).toBe(18); // A(1) + 7 + K(10) = 18
      expect(result.isSoft).toBe(false);
    });

    it('should handle multiple aces correctly', () => {
      const cards: Card[] = [
        { suit: 'hearts' as Suit, rank: 'A' as Rank, value: 11, isFaceUp: true },
        { suit: 'clubs' as Suit, rank: 'A' as Rank, value: 11, isFaceUp: true },
        { suit: 'diamonds' as Suit, rank: '9' as Rank, value: 9, isFaceUp: true }
      ];
      
      const result = calculateHandValue(cards);
      
      expect(result.value).toBe(21); // A(1) + A(11) + 9 = 21
      expect(result.isSoft).toBe(true);
    });
  });

  describe('createDeck', () => {
    it('should create a deck with 52 cards', () => {
      const deck = createDeck();
      
      expect(deck.length).toBe(52);
    });

    it('should include all suits and ranks', () => {
      const deck = createDeck();
      const suits = new Set(deck.map(card => card.suit));
      const ranks = new Set(deck.map(card => card.rank));
      
      expect(suits.size).toBe(4);
      expect(suits.has('hearts')).toBe(true);
      expect(suits.has('diamonds')).toBe(true);
      expect(suits.has('clubs')).toBe(true);
      expect(suits.has('spades')).toBe(true);
      
      expect(ranks.size).toBe(13);
      (['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as Rank[]).forEach(rank => {
        expect(ranks.has(rank)).toBe(true);
      });
    });
  });

  describe('shuffle', () => {
    it('should return an array of the same length', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle(original);
      
      expect(shuffled.length).toBe(original.length);
    });

    it('should contain the same elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle(original);
      
      expect(shuffled.sort()).toEqual(original.sort());
    });

    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffle(original);
      
      expect(original).toEqual(originalCopy);
    });
  });

  describe('defaultStrategy and defaultRules', () => {
    it('should define strategy for hard totals', () => {
      expect(defaultStrategy.hardTotals).toBeDefined();
      expect(Object.keys(defaultStrategy.hardTotals).length).toBeGreaterThan(0);
    });

    it('should define strategy for soft totals', () => {
      expect(defaultStrategy.softTotals).toBeDefined();
      expect(Object.keys(defaultStrategy.softTotals).length).toBeGreaterThan(0);
    });

    it('should define strategy for pairs', () => {
      expect(defaultStrategy.pairs).toBeDefined();
      expect(Object.keys(defaultStrategy.pairs).length).toBeGreaterThan(0);
    });

    it('should have default rules with valid properties', () => {
      expect(defaultRules.decks).toBeGreaterThan(0);
      expect(defaultRules.blackjackPayout).toBeGreaterThan(0);
      expect(typeof defaultRules.dealerStandsOnSoft17).toBe('boolean');
    });
  });
});
