import { Card, PokerHand, rankHand } from "./poker";

function createDeck(): Card[] {
  const suits = ["H", "D", "C", "S"] as const;
  const values = [
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
  ] as const;
  const deck: Card[] = [];

  try {
    for (const suit of suits) {
      for (const value of values) {
        deck.push(new Card(suit, value));
      }
    }
  } catch (error: any) {
    console.error("Error creating deck:", error.message);
    process.exit(1);
  }

  return deck;
}

function shuffle(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealHand(deck: Card[], count: number): PokerHand {
  try {
    return new PokerHand(deck.splice(0, count));
  } catch (error: any) {
    console.error("Error dealing hand:", error.message);
    throw error;
  }
}

function playPoker(): void {
  console.log("Welcome to Mini Poker Game!");

  try {
    const deck = shuffle(createDeck());

    const player1Hand = dealHand(deck, 5);
    const player2Hand = dealHand(deck, 5);

    PokerHand.validateDistinctHands(player1Hand, player2Hand);

    console.log(
      "Player 1's hand:",
      player1Hand.cards.map((c) => c.toString()).join(" ")
    );
    console.log("Player 1 has: " + rankHand(player1Hand));

    console.log(
      "Player 2's hand:",
      player2Hand.cards.map((c) => c.toString()).join(" ")
    );
    console.log("Player 2 has: " + rankHand(player2Hand));

    const result = player1Hand.compareWith(player2Hand);

    if (result > 0) {
      console.log("Player 1 wins!");
    } else if (result < 0) {
      console.log("Player 2 wins!");
    } else {
      console.log("It's a tie!");
    }
  } catch (error: any) {
    console.error("Game error:", error.message);
    process.exit(1);
  }
}

playPoker();
