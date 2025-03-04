# Poker Game with TDD in TypeScript

## Features

- Card and PokerHand classes with TypeScript typing
- Hand evaluation (high card, pair, two pairs, etc.)
- Comparison between hands
- Simple command-line interface to play a demo game

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm

### Installation

1. Clone the repository or download the source code
2. Install dependencies:

```bash
npm install
```

### Running Tests

To run the tests:

```bash
npm test
```

### Building the Project

To compile TypeScript to JavaScript:

```bash
npm run build
```

### Playing the Game

To play a demo game:

```bash
npm start
```

or

```bash
npm run play
```

## Project Structure

- `src/poker.ts` - Core poker classes and functions
- `src/playPoker.ts` - Command-line interface to play the game
- `tests/poker.test.ts` - Test cases for the poker functionality
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts

## Game Rules

The game evaluates 5-card poker hands according to standard rules:

1. Royal Flush
2. Straight Flush
3. Four of a Kind
4. Full House
5. Flush
6. Straight
7. Three of a Kind
8. Two Pair
9. Pair
10. High Card
