import { strict as assert } from "assert";
import { Card, PokerHand, rankHand } from "../src/poker";

describe("Poker Game Tests", () => {
  describe("Card class", () => {
    it("should create a card with suit and value", () => {
      const card = new Card("H", "10");
      assert.strictEqual(card.suit, "H");
      assert.strictEqual(card.value, "10");
    });

    it("should validate card creation", () => {
      assert.throws(() => new Card("X" as any, "10"), Error);
      assert.throws(() => new Card("H", "15" as any), Error);
    });

    it("should reject all invalid suits", () => {
      const invalidSuits = ["Z", "Y", "1", "h", "d", "#", ""];
      invalidSuits.forEach((invalidSuit) => {
        assert.throws(
          () => new Card(invalidSuit as any, "10"),
          (error) =>
            error instanceof Error && error.message.includes("Invalid suit"),
          `Should reject invalid suit: ${invalidSuit}`
        );
      });
    });

    it("should reject all invalid values", () => {
      const invalidValues = ["0", "11", "12", "-1", "B", "j", "q", ""];
      invalidValues.forEach((invalidValue) => {
        assert.throws(
          () => new Card("H", invalidValue as any),
          (error) =>
            error instanceof Error && error.message.includes("Invalid value"),
          `Should reject invalid value: ${invalidValue}`
        );
      });
    });

    it("should accept all valid suits and values", () => {
      const validSuits = ["H", "D", "C", "S"];
      const validValues = [
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

      validSuits.forEach((suit) => {
        validValues.forEach((value) => {
          assert.doesNotThrow(
            () => new Card(suit as any, value as any),
            `Should accept valid suit and value: ${suit}${value}`
          );
        });
      });
    });
  });

  describe("PokerHand class", () => {
    it("should reject hands with incorrect number of cards", () => {
      const cards4 = [
        new Card("H", "A"),
        new Card("D", "K"),
        new Card("C", "Q"),
        new Card("S", "J"),
      ];
      const cards6 = [
        new Card("H", "A"),
        new Card("D", "K"),
        new Card("C", "Q"),
        new Card("S", "J"),
        new Card("H", "10"),
        new Card("D", "9"),
      ];

      assert.throws(
        () => new PokerHand(cards4),
        (error) =>
          error instanceof Error && error.message.includes("exactly 5 cards")
      );
      assert.throws(
        () => new PokerHand(cards6),
        (error) =>
          error instanceof Error && error.message.includes("exactly 5 cards")
      );
      assert.throws(
        () => new PokerHand([]),
        (error) =>
          error instanceof Error && error.message.includes("exactly 5 cards")
      );
      assert.throws(
        () => new PokerHand(null as any),
        (error) =>
          error instanceof Error && error.message.includes("exactly 5 cards")
      );
    });

    it("should reject hands with duplicate cards", () => {
      const duplicateCards = [
        new Card("H", "A"),
        new Card("D", "K"),
        new Card("C", "Q"),
        new Card("S", "J"),
        new Card("H", "A"),
      ];

      assert.throws(
        () => new PokerHand(duplicateCards),
        (error) =>
          error instanceof Error &&
          error.message === "Duplicate cards are not allowed in a poker hand",
        "Should reject hands with duplicate cards"
      );
    });

    it("should detect shared cards between two players", () => {
      const hand1 = new PokerHand([
        new Card("H", "A"),
        new Card("D", "K"),
        new Card("C", "Q"),
        new Card("S", "J"),
        new Card("H", "10"),
      ]);

      const hand2 = new PokerHand([
        new Card("H", "A"),
        new Card("D", "5"),
        new Card("C", "6"),
        new Card("S", "7"),
        new Card("H", "8"),
      ]);

      assert.strictEqual(hand1.hasSharedCardsWith(hand2), true);

      assert.throws(
        () => PokerHand.validateDistinctHands(hand1, hand2),
        (error) =>
          error instanceof Error &&
          error.message === "Players cannot share the same card",
        "Should detect when players share the same card"
      );
    });

    it("should allow hands with no shared cards", () => {
      const hand1 = new PokerHand([
        new Card("H", "A"),
        new Card("D", "K"),
        new Card("C", "Q"),
        new Card("S", "J"),
        new Card("H", "10"),
      ]);

      const hand2 = new PokerHand([
        new Card("S", "A"),
        new Card("C", "K"),
        new Card("D", "Q"),
        new Card("H", "J"),
        new Card("S", "10"),
      ]);

      assert.strictEqual(hand1.hasSharedCardsWith(hand2), false);
      assert.doesNotThrow(() => PokerHand.validateDistinctHands(hand1, hand2));
    });
  });

  describe("Hand evaluation", () => {
    it("should identify a high card", () => {
      const hand = new PokerHand([
        new Card("H", "A"),
        new Card("D", "5"),
        new Card("C", "9"),
        new Card("S", "2"),
        new Card("H", "7"),
      ]);
      assert.strictEqual(rankHand(hand), "High Card");
    });

    it("should identify a pair", () => {
      const hand = new PokerHand([
        new Card("H", "10"),
        new Card("D", "10"),
        new Card("C", "9"),
        new Card("S", "2"),
        new Card("H", "7"),
      ]);
      assert.strictEqual(rankHand(hand), "Pair");
    });

    it("should identify two pairs", () => {
      const hand = new PokerHand([
        new Card("H", "10"),
        new Card("D", "10"),
        new Card("C", "7"),
        new Card("S", "7"),
        new Card("H", "2"),
      ]);
      assert.strictEqual(rankHand(hand), "Two Pair");
    });

    it("should identify three of a kind", () => {
      const hand = new PokerHand([
        new Card("H", "10"),
        new Card("D", "10"),
        new Card("C", "10"),
        new Card("S", "2"),
        new Card("H", "7"),
      ]);
      assert.strictEqual(rankHand(hand), "Three of a Kind");
    });

    it("should identify a straight", () => {
      const hand = new PokerHand([
        new Card("H", "3"),
        new Card("D", "4"),
        new Card("C", "5"),
        new Card("S", "6"),
        new Card("H", "7"),
      ]);
      assert.strictEqual(rankHand(hand), "Straight");
    });

    it("should identify a flush", () => {
      const hand = new PokerHand([
        new Card("H", "2"),
        new Card("H", "5"),
        new Card("H", "9"),
        new Card("H", "K"),
        new Card("H", "7"),
      ]);
      assert.strictEqual(rankHand(hand), "Flush");
    });

    it("should identify a full house", () => {
      const hand = new PokerHand([
        new Card("H", "10"),
        new Card("D", "10"),
        new Card("C", "10"),
        new Card("S", "7"),
        new Card("H", "7"),
      ]);
      assert.strictEqual(rankHand(hand), "Full House");
    });

    it("should identify four of a kind", () => {
      const hand = new PokerHand([
        new Card("H", "10"),
        new Card("D", "10"),
        new Card("C", "10"),
        new Card("S", "10"),
        new Card("H", "7"),
      ]);
      assert.strictEqual(rankHand(hand), "Four of a Kind");
    });

    it("should identify a straight flush", () => {
      const hand = new PokerHand([
        new Card("H", "3"),
        new Card("H", "4"),
        new Card("H", "5"),
        new Card("H", "6"),
        new Card("H", "7"),
      ]);
      assert.strictEqual(rankHand(hand), "Straight Flush");
    });

    it("should identify a royal flush", () => {
      const hand = new PokerHand([
        new Card("H", "10"),
        new Card("H", "J"),
        new Card("H", "Q"),
        new Card("H", "K"),
        new Card("H", "A"),
      ]);
      assert.strictEqual(rankHand(hand), "Royal Flush");
    });

    it("should handle ace-low straight (A-2-3-4-5)", () => {
      const hand = new PokerHand([
        new Card("H", "A"),
        new Card("D", "2"),
        new Card("C", "3"),
        new Card("S", "4"),
        new Card("H", "5"),
      ]);
      assert.strictEqual(rankHand(hand), "Straight");
    });

    it("should handle hands with different suits/values correctly", () => {
      const hand = new PokerHand([
        new Card("H", "A"),
        new Card("S", "A"),
        new Card("H", "K"),
        new Card("H", "Q"),
        new Card("H", "J"),
      ]);

      assert.notStrictEqual(rankHand(hand), "Royal Flush");
      assert.notStrictEqual(rankHand(hand), "Flush");
      assert.strictEqual(rankHand(hand), "Pair");
    });
  });

  describe("Game simulation", () => {
    it("should compare two hands and determine a winner", () => {
      const hand1 = new PokerHand([
        new Card("H", "10"),
        new Card("D", "10"),
        new Card("C", "10"),
        new Card("S", "2"),
        new Card("H", "7"),
      ]);

      const hand2 = new PokerHand([
        new Card("H", "9"),
        new Card("D", "9"),
        new Card("C", "9"),
        new Card("S", "9"),
        new Card("H", "7"),
      ]);

      assert.strictEqual(hand1.compareWith(hand2), -1);
      assert.strictEqual(hand2.compareWith(hand1), 1);
    });

    it("should handle ties correctly", () => {
      const hand1 = new PokerHand([
        new Card("H", "A"),
        new Card("H", "K"),
        new Card("H", "Q"),
        new Card("H", "J"),
        new Card("H", "10"),
      ]);

      const hand2 = new PokerHand([
        new Card("D", "A"),
        new Card("D", "K"),
        new Card("D", "Q"),
        new Card("D", "J"),
        new Card("D", "10"),
      ]);

      assert.strictEqual(
        hand1.compareWith(hand2),
        0,
        "Should be a tie with identical ranks"
      );
    });

    it("should compare hands with same rank but different high cards", () => {
      const hand1 = new PokerHand([
        new Card("H", "A"),
        new Card("H", "9"),
        new Card("H", "7"),
        new Card("H", "5"),
        new Card("H", "2"),
      ]);

      const hand2 = new PokerHand([
        new Card("D", "K"),
        new Card("D", "9"),
        new Card("D", "7"),
        new Card("D", "5"),
        new Card("D", "2"),
      ]);

      assert.strictEqual(
        hand1.compareWith(hand2),
        1,
        "Ace-high flush should beat King-high flush"
      );
      assert.strictEqual(hand2.compareWith(hand1), -1);
    });
  });
});
