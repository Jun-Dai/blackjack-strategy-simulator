
import { 
  BlackjackRules, 
  Card, 
  Hand, 
  DealerHand, 
  PlayerStrategy, 
  Decision, 
  SimulationResult,
  createDeck,
  shuffle,
  calculateHandValue
} from './blackjack';

export class BlackjackSimulator {
  private rules: BlackjackRules;
  private strategy: PlayerStrategy;
  private shoe: Card[] = [];
  private penetration: number = 0.75; // When to reshuffle the shoe
  private initialCardsDealt: number = 0;
  private results: SimulationResult = {
    handsPlayed: 0,
    handsWon: 0,
    handsLost: 0,
    handsPushed: 0,
    blackjacks: 0,
    busts: 0,
    totalBet: 0,
    totalWinnings: 0,
    netProfit: 0,
    houseEdge: 0,
    winRate: 0
  };

  constructor(rules: BlackjackRules, strategy: PlayerStrategy) {
    this.rules = rules;
    this.strategy = strategy;
    this.initializeShoe();
  }

  private initializeShoe(): void {
    this.shoe = [];
    for (let i = 0; i < this.rules.decks; i++) {
      this.shoe = [...this.shoe, ...createDeck()];
    }
    this.shoe = shuffle(this.shoe);
    this.initialCardsDealt = 0;
  }

  private needToReshuffle(): boolean {
    const totalCards = this.rules.decks * 52;
    const cardsDealt = this.initialCardsDealt;
    return cardsDealt >= totalCards * this.penetration;
  }

  private drawCard(faceUp: boolean = true): Card {
    if (this.shoe.length === 0 || this.needToReshuffle()) {
      this.initializeShoe();
    }
    
    const card = this.shoe.pop()!;
    card.isFaceUp = faceUp;
    this.initialCardsDealt++;
    return card;
  }

  private dealInitialHands(): { playerHand: Hand, dealerHand: DealerHand } {
    const playerHand: Hand = {
      cards: [this.drawCard(), this.drawCard()],
      value: 0,
      isSoft: false,
      isBusted: false,
      isBlackjack: false,
      isPair: false,
      hasAce: false,
      bet: this.rules.minimumBet
    };
    
    const dealerHand: DealerHand = {
      cards: [this.drawCard(false), this.drawCard()],
      value: 0,
      isSoft: false,
      isBusted: false,
      isBlackjack: false,
      upCardValue: 0
    };
    
    // Calculate hand values
    const playerCalc = calculateHandValue(playerHand.cards);
    playerHand.value = playerCalc.value;
    playerHand.isSoft = playerCalc.isSoft;
    playerHand.hasAce = playerHand.cards.some(card => card.rank === "A");
    playerHand.isPair = playerHand.cards.length === 2 && 
                         playerHand.cards[0].rank === playerHand.cards[1].rank;
    playerHand.isBlackjack = playerHand.value === 21 && playerHand.cards.length === 2;
    
    // Only consider dealer's up card for now
    dealerHand.upCardValue = dealerHand.cards[1].value;
    
    return { playerHand, dealerHand };
  }

  private getStrategyDecision(playerHand: Hand, dealerUpCardValue: number): Decision {
    const dealerKey = dealerUpCardValue === 10 ? "10" : 
                      dealerUpCardValue === 11 ? "A" : dealerUpCardValue.toString();
    
    // Check for pairs first
    if (playerHand.isPair) {
      const pairRank = playerHand.cards[0].rank;
      if (this.strategy.pairs[pairRank] && this.strategy.pairs[pairRank][dealerKey]) {
        return this.strategy.pairs[pairRank][dealerKey];
      }
    }
    
    // Check for soft totals (hands with an Ace counted as 11)
    if (playerHand.isSoft) {
      const softTotal = playerHand.value.toString();
      if (this.strategy.softTotals[softTotal] && this.strategy.softTotals[softTotal][dealerKey]) {
        return this.strategy.softTotals[softTotal][dealerKey];
      }
    }
    
    // Default to hard totals
    const hardTotal = playerHand.value.toString();
    if (this.strategy.hardTotals[hardTotal] && this.strategy.hardTotals[hardTotal][dealerKey]) {
      return this.strategy.hardTotals[hardTotal][dealerKey];
    }
    
    // Default decision if no strategy is defined
    return playerHand.value >= 17 ? "stand" : "hit";
  }

  private handlePlayerTurn(hand: Hand, dealerUpCardValue: number): Hand {
    // Check for blackjack first
    if (hand.isBlackjack) {
      return hand;
    }
    
    let currentHand = { ...hand };
    let continuePlaying = true;
    
    while (continuePlaying && !currentHand.isBusted) {
      const decision = this.getStrategyDecision(currentHand, dealerUpCardValue);
      let handCalc; // Declare handCalc outside the switch to avoid redeclaration
      
      switch (decision) {
        case "hit":
          currentHand.cards.push(this.drawCard());
          handCalc = calculateHandValue(currentHand.cards);
          currentHand.value = handCalc.value;
          currentHand.isSoft = handCalc.isSoft;
          currentHand.isBusted = currentHand.value > 21;
          break;
          
        case "stand":
          continuePlaying = false;
          break;
          
        case "double":
          // Can only double on first two cards
          if (currentHand.cards.length === 2) {
            currentHand.bet *= 2;
            currentHand.cards.push(this.drawCard());
            handCalc = calculateHandValue(currentHand.cards);
            currentHand.value = handCalc.value;
            currentHand.isSoft = handCalc.isSoft;
            currentHand.isBusted = currentHand.value > 21;
            continuePlaying = false;
          } else {
            // If can't double, hit instead
            currentHand.cards.push(this.drawCard());
            handCalc = calculateHandValue(currentHand.cards);
            currentHand.value = handCalc.value;
            currentHand.isSoft = handCalc.isSoft;
            currentHand.isBusted = currentHand.value > 21;
          }
          break;
          
        case "surrender":
          // Can only surrender on first two cards
          if (currentHand.cards.length === 2 && this.rules.surrenderAllowed) {
            currentHand.bet /= 2;
            currentHand.result = "lose";
            continuePlaying = false;
          } else {
            // If can't surrender, hit instead
            currentHand.cards.push(this.drawCard());
            handCalc = calculateHandValue(currentHand.cards);
            currentHand.value = handCalc.value;
            currentHand.isSoft = handCalc.isSoft;
            currentHand.isBusted = currentHand.value > 21;
          }
          break;
          
        case "split":
          // Splitting not simulated in this simplified version
          // In a real game, this would create a new hand
          currentHand.cards.push(this.drawCard());
          handCalc = calculateHandValue(currentHand.cards);
          currentHand.value = handCalc.value;
          currentHand.isSoft = handCalc.isSoft;
          currentHand.isBusted = currentHand.value > 21;
          break;
      }
    }
    
    return currentHand;
  }

  private handleDealerTurn(hand: DealerHand): DealerHand {
    // Flip the dealer's hole card
    hand.cards[0].isFaceUp = true;
    
    // Calculate full hand value
    const dealerCalc = calculateHandValue(hand.cards);
    hand.value = dealerCalc.value;
    hand.isSoft = dealerCalc.isSoft;
    hand.isBlackjack = hand.value === 21 && hand.cards.length === 2;
    
    // Dealer follows house rules
    let dealerStandValue = this.rules.dealerStandsOnSoft17 ? 17 : 18;
    
    while ((hand.value < dealerStandValue) || (hand.value === 17 && hand.isSoft && !this.rules.dealerStandsOnSoft17)) {
      hand.cards.push(this.drawCard());
      const newCalc = calculateHandValue(hand.cards);
      hand.value = newCalc.value;
      hand.isSoft = newCalc.isSoft;
    }
    
    hand.isBusted = hand.value > 21;
    
    return hand;
  }

  private determineOutcome(playerHand: Hand, dealerHand: DealerHand): Hand {
    const resultHand = { ...playerHand };
    
    // Handle player bust
    if (resultHand.isBusted) {
      resultHand.result = "lose";
      resultHand.payout = 0;
      return resultHand;
    }
    
    // Handle surrender (result already set)
    if (resultHand.result === "lose") {
      resultHand.payout = 0;
      return resultHand;
    }
    
    // Handle player blackjack
    if (resultHand.isBlackjack) {
      if (dealerHand.isBlackjack) {
        resultHand.result = "push";
        resultHand.payout = resultHand.bet;
      } else {
        resultHand.result = "blackjack";
        resultHand.payout = resultHand.bet + resultHand.bet * this.rules.blackjackPayout;
      }
      return resultHand;
    }
    
    // Handle dealer blackjack
    if (dealerHand.isBlackjack) {
      resultHand.result = "lose";
      resultHand.payout = 0;
      return resultHand;
    }
    
    // Handle dealer bust
    if (dealerHand.isBusted) {
      resultHand.result = "win";
      resultHand.payout = resultHand.bet * 2;
      return resultHand;
    }
    
    // Compare hands
    if (resultHand.value > dealerHand.value) {
      resultHand.result = "win";
      resultHand.payout = resultHand.bet * 2;
    } else if (resultHand.value < dealerHand.value) {
      resultHand.result = "lose";
      resultHand.payout = 0;
    } else {
      resultHand.result = "push";
      resultHand.payout = resultHand.bet;
    }
    
    return resultHand;
  }

  private updateResults(hand: Hand): void {
    this.results.handsPlayed++;
    this.results.totalBet += hand.bet;
    
    switch (hand.result) {
      case "win":
        this.results.handsWon++;
        this.results.totalWinnings += hand.payout || 0;
        break;
      case "lose":
        this.results.handsLost++;
        break;
      case "push":
        this.results.handsPushed++;
        this.results.totalWinnings += hand.payout || 0;
        break;
      case "blackjack":
        this.results.handsWon++;
        this.results.blackjacks++;
        this.results.totalWinnings += hand.payout || 0;
        break;
    }
    
    if (hand.isBusted) {
      this.results.busts++;
    }
  }

  public simulateHand(): { playerHand: Hand, dealerHand: DealerHand } {
    // Deal initial cards
    const { playerHand, dealerHand } = this.dealInitialHands();
    
    // Handle player turn
    const updatedPlayerHand = this.handlePlayerTurn(playerHand, dealerHand.upCardValue);
    
    // Handle dealer turn
    const updatedDealerHand = this.handleDealerTurn(dealerHand);
    
    // Determine outcome and update results
    const finalPlayerHand = this.determineOutcome(updatedPlayerHand, updatedDealerHand);
    this.updateResults(finalPlayerHand);
    
    return { playerHand: finalPlayerHand, dealerHand: updatedDealerHand };
  }

  public runSimulation(iterations: number): SimulationResult {
    // Reset results
    this.results = {
      handsPlayed: 0,
      handsWon: 0,
      handsLost: 0,
      handsPushed: 0,
      blackjacks: 0,
      busts: 0,
      totalBet: 0,
      totalWinnings: 0,
      netProfit: 0,
      houseEdge: 0,
      winRate: 0
    };
    
    // Run the simulation
    for (let i = 0; i < iterations; i++) {
      this.simulateHand();
    }
    
    // Calculate final statistics
    this.results.netProfit = this.results.totalWinnings - this.results.totalBet;
    this.results.houseEdge = (this.results.totalBet - this.results.totalWinnings) / this.results.totalBet * 100;
    this.results.winRate = (this.results.handsWon / this.results.handsPlayed) * 100;
    
    return { ...this.results };
  }
}
