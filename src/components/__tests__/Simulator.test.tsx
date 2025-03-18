
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Simulator from '../Simulator';
import { BlackjackSimulator } from '../../lib/simulator';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('../../lib/simulator', () => ({
  BlackjackSimulator: jest.fn()
}));

// Mock child components
jest.mock('../BlackjackRulesConfig', () => ({
  __esModule: true,
  default: ({ rules, onRulesChange }: any) => (
    <div data-testid="rules-config">
      <button onClick={() => onRulesChange({ ...rules, decks: rules.decks + 1 })}>
        Change Rules
      </button>
    </div>
  )
}));

jest.mock('../StrategyEditor', () => ({
  __esModule: true,
  default: ({ strategy, onStrategyChange }: any) => (
    <div data-testid="strategy-editor">
      <button onClick={() => onStrategyChange({ ...strategy, testKey: 'modified' })}>
        Change Strategy
      </button>
    </div>
  )
}));

jest.mock('../SimulationResults', () => ({
  __esModule: true,
  default: ({ results, isLoading }: any) => (
    <div data-testid="simulation-results">
      {isLoading ? 'Loading...' : (results ? 'Results: ' + results.handsPlayed : 'No results')}
    </div>
  )
}));

jest.mock('../StrategyManager', () => ({
  __esModule: true,
  default: ({ currentStrategy, onStrategyLoad }: any) => (
    <div data-testid="strategy-manager">
      <button onClick={() => onStrategyLoad({ ...currentStrategy, loaded: true })}>
        Load Strategy
      </button>
    </div>
  )
}));

describe('Simulator Component', () => {
  const mockRunSimulation = jest.fn().mockReturnValue({
    handsPlayed: 1000,
    handsWon: 400,
    handsPushed: 100,
    handsLost: 500,
    totalBet: 10000,
    totalWinnings: 9000,
    netProfit: -1000,
    houseEdge: 10,
    winRate: 40,
    blackjacks: 50,
    busts: 200
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (BlackjackSimulator as jest.Mock).mockImplementation(() => ({
      runSimulation: mockRunSimulation
    }));
  });

  it('renders all child components', () => {
    render(<Simulator />);
    
    expect(screen.getByTestId('rules-config')).toBeInTheDocument();
    expect(screen.getByTestId('strategy-editor')).toBeInTheDocument();
    expect(screen.getByTestId('simulation-results')).toBeInTheDocument();
    expect(screen.getByTestId('strategy-manager')).toBeInTheDocument();
  });

  it('allows changing rules via BlackjackRulesConfig', () => {
    render(<Simulator />);
    
    fireEvent.click(screen.getByText('Change Rules'));
    
    // When we run the simulation, it should use the updated rules
    fireEvent.click(screen.getByText('Run Simulation'));
    
    expect(BlackjackSimulator).toHaveBeenCalled();
    const simulatorInstance = (BlackjackSimulator as jest.Mock).mock.calls[0][0];
    expect(simulatorInstance.decks).toBe(7); // default is 6, we incremented by 1
  });

  it('allows changing strategy via StrategyEditor', () => {
    render(<Simulator />);
    
    fireEvent.click(screen.getByText('Change Strategy'));
    
    // When we run the simulation, it should use the updated strategy
    fireEvent.click(screen.getByText('Run Simulation'));
    
    expect(BlackjackSimulator).toHaveBeenCalled();
    const strategy = (BlackjackSimulator as jest.Mock).mock.calls[0][1];
    expect(strategy.testKey).toBe('modified');
  });

  it('allows loading strategy via StrategyManager', () => {
    render(<Simulator />);
    
    fireEvent.click(screen.getByText('Load Strategy'));
    
    // When we run the simulation, it should use the loaded strategy
    fireEvent.click(screen.getByText('Run Simulation'));
    
    expect(BlackjackSimulator).toHaveBeenCalled();
    const strategy = (BlackjackSimulator as jest.Mock).mock.calls[0][1];
    expect(strategy.loaded).toBe(true);
  });

  it('runs simulation with correct parameters', async () => {
    render(<Simulator />);
    
    // Change iterations
    fireEvent.change(screen.getByLabelText('Number of Hands'), {
      target: { value: '10000' }
    });
    
    // Run simulation
    fireEvent.click(screen.getByText('Run Simulation'));
    
    // Should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for simulation to complete
    await waitFor(() => {
      expect(mockRunSimulation).toHaveBeenCalledWith(10000);
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('10,000'));
    });
    
    // Should show results
    expect(screen.getByText('Results: 1000')).toBeInTheDocument();
  });

  it('handles simulation errors', async () => {
    // Make the simulation throw an error
    (BlackjackSimulator as jest.Mock).mockImplementation(() => ({
      runSimulation: jest.fn().mockImplementation(() => {
        throw new Error('Simulation error');
      })
    }));
    
    render(<Simulator />);
    
    // Run simulation
    fireEvent.click(screen.getByText('Run Simulation'));
    
    // Wait for error to be handled
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An error occurred during simulation');
    });
  });
});
