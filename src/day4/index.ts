import { open } from "fs/promises";

interface Scratchcard {
  id: number;
  winners: Set<number>;
  numbers: number[];
}

const parseLine = (line: string): Scratchcard => {
  const regex = /^Card\s*(\d+):((\s*\d+)+)\s*|((\s*\d+)+)$/gm;

  let m = regex.exec(line);
  if (!m) {
    throw new Error("No match");
  }
  const card = m[1];
  const winners = m[2];

  regex.lastIndex++;

  m = regex.exec(line);
  if (!m) {
    throw new Error("No match");
  }

  const numbers = m[0];

  return {
    id: Number(card),
    winners: new Set(
      winners
        .split(" ")
        .filter((n) => n.trim() !== "")
        .map(Number)
        .filter((n) => !Number.isNaN(n))
        .sort((a, b) => a - b),
    ),
    numbers: numbers
      .split(" ")
      .filter((n) => n.trim() !== "")
      .map(Number)
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b),
  };
};

const calcCardPrize = (
  card: Scratchcard,
): { prize: number; matches: number } => {
  const matches = card.numbers.filter((number) =>
    card.winners.has(number),
  ).length;

  if (matches === 0) {
    return { prize: 0, matches: 0 };
  }

  if (matches === 1) {
    return { prize: 1, matches };
  }

  return { prize: 2 ** (matches - 1), matches };
};

(async () => {
  const file = await open("./input.txt");
  const copies: Map<number, number> = new Map();

  for await (const line of file.readLines()) {
    const scratchcard = parseLine(line);

    const currentCardCopies = copies.get(scratchcard.id) || 0;
    copies.set(scratchcard.id, currentCardCopies + 1)

    const { matches } = calcCardPrize(scratchcard);
    for (let i = 0; i < matches; i++) {
      const numCards = copies.get(scratchcard.id + i + 1) || 0;
      copies.set(scratchcard.id + i + 1, numCards + (currentCardCopies + 1));
    }
  }

  console.log(Array.from(copies.values()).reduce((acc, v) => acc + v, 0));
})();
