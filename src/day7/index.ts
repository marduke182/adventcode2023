import { open } from "fs/promises";
import { compareHand, getHandScore } from "./utils";

interface Hand {
  cards: string;
  bid: number;
}

interface HandWithScore extends Hand {
  score: number;
}
const parseLine = (line: string): Hand => {
  const [cards, bidString] = line.split(" ");
  return {
    cards,
    bid: Number(bidString),
  };
};

const part1 = async () => {
  const file = await open("./input.txt");
  const handsWithScore: HandWithScore[] = [];
  for await (const line of file.readLines()) {
    const hand = parseLine(line);
    handsWithScore.push({
      cards: hand.cards,
      bid: hand.bid,
      score: getHandScore(hand.cards),
    });
  }

  const prize = handsWithScore
    .sort((a, b) => {
      if (a.score === b.score) {
        return compareHand(a.cards, b.cards);
      }
      return a.score - b.score
    })
    .reduce((acc, hand, i) => {
      return acc + hand.bid * (i + 1);
    }, 0);
  console.log(prize);
};

part1();
