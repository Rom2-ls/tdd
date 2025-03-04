type Suit = "H" | "D" | "C" | "S";
type CardValue =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";
type HandRank =
  | "High Card"
  | "Pair"
  | "Two Pair"
  | "Three of a Kind"
  | "Straight"
  | "Flush"
  | "Full House"
  | "Four of a Kind"
  | "Straight Flush"
  | "Royal Flush";

interface ValueMap {
  [key: string]: number;
}

class Card {
  suit: Suit;
  value: CardValue;

  constructor(suit: Suit, value: CardValue) {
    const validSuits: Suit[] = ["H", "D", "C", "S"];
    const validValues: CardValue[] = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];

    if (!validSuits.includes(suit)) {
      throw new Error(
        `Invalid suit: ${suit}. Valid suits are: H (Hearts), D (Diamonds), C (Clubs), S (Spades).`
      );
    }

    if (!validValues.includes(value)) {
      throw new Error(
        `Invalid value: ${value}. Valid values are: 2-10, J, Q, K, A.`
      );
    }

    this.suit = suit;
    this.value = value;
  }

  getValue(): number {
    const valueMap: ValueMap = {
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      "10": 10,
      J: 11,
      Q: 12,
      K: 13,
      A: 14,
    };
    return valueMap[this.value];
  }

  toString(): string {
    const suitSymbols: { [key in Suit]: string } = {
      H: "♥",
      D: "♦",
      C: "♣",
      S: "♠",
    };
    return `${this.value}${suitSymbols[this.suit]}`;
  }

  equals(other: Card): boolean {
    return this.suit === other.suit && this.value === other.value;
  }
}

class PokerHand {
  cards: Card[];

  constructor(cards: Card[]) {
    if (!cards || cards.length !== 5) {
      throw new Error("A poker hand must contain exactly 5 cards");
    }

    this.checkDuplicates(cards);

    this.cards = cards;
  }

  private checkDuplicates(cards: Card[]): void {
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        if (cards[i].equals(cards[j])) {
          throw new Error("Duplicate cards are not allowed in a poker hand");
        }
      }
    }
  }

  hasSharedCardsWith(otherHand: PokerHand): boolean {
    for (const card1 of this.cards) {
      for (const card2 of otherHand.cards) {
        if (card1.equals(card2)) {
          return true;
        }
      }
    }
    return false;
  }

  static validateDistinctHands(hand1: PokerHand, hand2: PokerHand): void {
    if (hand1.hasSharedCardsWith(hand2)) {
      throw new Error("Players cannot share the same card");
    }
  }

  getValues(): number[] {
    return this.cards.map((card) => card.getValue());
  }

  getSuits(): Suit[] {
    return this.cards.map((card) => card.suit);
  }

  getValueCounts(): { [key: number]: number } {
    const counts: { [key: number]: number } = {};
    this.getValues().forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  }

  compareWith(otherHand: PokerHand): number {
    const rank1 = getRankValue(rankHand(this));
    const rank2 = getRankValue(rankHand(otherHand));

    if (rank1 !== rank2) {
      return rank1 > rank2 ? 1 : -1;
    }

    const values1 = [...this.getValues()].sort((a, b) => b - a);
    const values2 = [...otherHand.getValues()].sort((a, b) => b - a);

    for (let i = 0; i < values1.length; i++) {
      if (values1[i] !== values2[i]) {
        return values1[i] > values2[i] ? 1 : -1;
      }
    }

    return 0; // Tie
  }
}

function hasRoyalFlush(hand: PokerHand): boolean {
  const values = hand.getValues();
  return (
    hasFlush(hand) &&
    values.includes(10) &&
    values.includes(11) &&
    values.includes(12) &&
    values.includes(13) &&
    values.includes(14)
  );
}

function hasStraightFlush(hand: PokerHand): boolean {
  return hasStraight(hand) && hasFlush(hand);
}

function hasFourOfAKind(hand: PokerHand): boolean {
  const valueCounts = hand.getValueCounts();
  return Object.values(valueCounts).includes(4);
}

function hasFullHouse(hand: PokerHand): boolean {
  const valueCounts = hand.getValueCounts();
  return (
    Object.values(valueCounts).includes(3) &&
    Object.values(valueCounts).includes(2)
  );
}

function hasFlush(hand: PokerHand): boolean {
  const suits = hand.getSuits();
  return suits.every((suit) => suit === suits[0]);
}

function hasStraight(hand: PokerHand): boolean {
  const values = [...hand.getValues()].sort((a, b) => a - b);

  if (JSON.stringify(values) === JSON.stringify([2, 3, 4, 5, 14])) {
    return true;
  }

  if (new Set(values).size < 5) {
    return false;
  }

  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i - 1] + 1) {
      return false;
    }
  }
  return true;
}

function hasThreeOfAKind(hand: PokerHand): boolean {
  const valueCounts = hand.getValueCounts();
  return Object.values(valueCounts).includes(3);
}

function hasTwoPair(hand: PokerHand): boolean {
  const valueCounts = hand.getValueCounts();
  return Object.values(valueCounts).filter((count) => count === 2).length === 2;
}

function hasPair(hand: PokerHand): boolean {
  const valueCounts = hand.getValueCounts();
  return Object.values(valueCounts).includes(2);
}

function rankHand(hand: PokerHand): HandRank {
  if (hasRoyalFlush(hand)) return "Royal Flush";
  if (hasStraightFlush(hand)) return "Straight Flush";
  if (hasFourOfAKind(hand)) return "Four of a Kind";
  if (hasFullHouse(hand)) return "Full House";
  if (hasFlush(hand)) return "Flush";
  if (hasStraight(hand)) return "Straight";
  if (hasThreeOfAKind(hand)) return "Three of a Kind";
  if (hasTwoPair(hand)) return "Two Pair";
  if (hasPair(hand)) return "Pair";
  return "High Card";
}

function getRankValue(rank: HandRank): number {
  const ranks: HandRank[] = [
    "High Card",
    "Pair",
    "Two Pair",
    "Three of a Kind",
    "Straight",
    "Flush",
    "Full House",
    "Four of a Kind",
    "Straight Flush",
    "Royal Flush",
  ];
  return ranks.indexOf(rank);
}

export { Card, PokerHand, rankHand, HandRank };
