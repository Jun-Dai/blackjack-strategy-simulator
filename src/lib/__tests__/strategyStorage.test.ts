
import { 
  getSavedStrategies, 
  saveStrategy, 
  loadStrategyById, 
  deleteStrategyById,
  SavedStrategy
} from '../strategyStorage';
import { defaultStrategy } from '../blackjack';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock crypto.randomUUID
const originalRandomUUID = crypto.randomUUID;
const mockRandomUUID = jest.fn().mockReturnValue('test-uuid-123');
crypto.randomUUID = mockRandomUUID;

describe('Strategy Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    crypto.randomUUID = originalRandomUUID;
  });

  describe('getSavedStrategies', () => {
    it('should return an empty array when no strategies are saved', () => {
      const strategies = getSavedStrategies();
      expect(strategies).toEqual([]);
    });

    it('should return saved strategies from localStorage', () => {
      const mockStrategies: SavedStrategy[] = [{
        id: 'test-id',
        name: 'Test Strategy',
        createdAt: new Date().toISOString(),
        strategy: defaultStrategy
      }];
      
      localStorageMock.setItem('blackjack-strategies', JSON.stringify(mockStrategies));
      
      const strategies = getSavedStrategies();
      expect(strategies).toEqual(mockStrategies);
    });

    it('should handle errors and return empty array', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorageMock.setItem('blackjack-strategies', 'invalid-json');
      
      const strategies = getSavedStrategies();
      
      expect(strategies).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('saveStrategy', () => {
    it('should save a new strategy to localStorage', () => {
      const name = 'New Strategy';
      const result = saveStrategy(name, defaultStrategy);
      
      expect(result.id).toBe('test-uuid-123');
      expect(result.name).toBe(name);
      expect(result.strategy).toEqual(defaultStrategy);
      
      const savedStrategies = JSON.parse(localStorageMock.getItem('blackjack-strategies') || '[]');
      expect(savedStrategies).toHaveLength(1);
      expect(savedStrategies[0].id).toBe('test-uuid-123');
    });

    it('should add to existing strategies', () => {
      const existingStrategy = {
        id: 'existing-id',
        name: 'Existing Strategy',
        createdAt: new Date().toISOString(),
        strategy: defaultStrategy
      };
      
      localStorageMock.setItem('blackjack-strategies', JSON.stringify([existingStrategy]));
      
      saveStrategy('New Strategy', defaultStrategy);
      
      const savedStrategies = JSON.parse(localStorageMock.getItem('blackjack-strategies') || '[]');
      expect(savedStrategies).toHaveLength(2);
      expect(savedStrategies[0].id).toBe('existing-id');
      expect(savedStrategies[1].id).toBe('test-uuid-123');
    });
  });

  describe('loadStrategyById', () => {
    it('should return null if strategy does not exist', () => {
      const result = loadStrategyById('non-existent-id');
      expect(result).toBeNull();
    });

    it('should load a strategy by id', () => {
      const mockStrategy = {
        id: 'test-id',
        name: 'Test Strategy',
        createdAt: new Date().toISOString(),
        strategy: defaultStrategy
      };
      
      localStorageMock.setItem('blackjack-strategies', JSON.stringify([mockStrategy]));
      
      const result = loadStrategyById('test-id');
      expect(result).toEqual(defaultStrategy);
    });
  });

  describe('deleteStrategyById', () => {
    it('should delete a strategy by id', () => {
      const mockStrategies = [
        {
          id: 'id-1',
          name: 'Strategy 1',
          createdAt: new Date().toISOString(),
          strategy: defaultStrategy
        },
        {
          id: 'id-2',
          name: 'Strategy 2',
          createdAt: new Date().toISOString(),
          strategy: defaultStrategy
        }
      ];
      
      localStorageMock.setItem('blackjack-strategies', JSON.stringify(mockStrategies));
      
      deleteStrategyById('id-1');
      
      const savedStrategies = JSON.parse(localStorageMock.getItem('blackjack-strategies') || '[]');
      expect(savedStrategies).toHaveLength(1);
      expect(savedStrategies[0].id).toBe('id-2');
    });

    it('should do nothing if strategy does not exist', () => {
      const mockStrategies = [
        {
          id: 'id-1',
          name: 'Strategy 1',
          createdAt: new Date().toISOString(),
          strategy: defaultStrategy
        }
      ];
      
      localStorageMock.setItem('blackjack-strategies', JSON.stringify(mockStrategies));
      
      deleteStrategyById('non-existent-id');
      
      const savedStrategies = JSON.parse(localStorageMock.getItem('blackjack-strategies') || '[]');
      expect(savedStrategies).toHaveLength(1);
      expect(savedStrategies[0].id).toBe('id-1');
    });
  });
});
