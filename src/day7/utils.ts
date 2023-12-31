const cardValue = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  J: 1,
};

const handTypeValue = {
  "5": 10000000000000,
  "41": 1000000000000,
  "32": 100000000000,
  "311": 10000000000,
  "221": 1000000000,
  "2111": 100000000,
};

const multiplier = [10000, 1000, 100, 10, 1];
export const getHandScore = (hand: string): number => {
  const cards: Record<string, number> = {};

  for (let i = 0; i < 5; i++) {
    const char = hand[i];
    if (cards[char] == null) {
      cards[char] = 0;
    }
    cards[char]++;
  }

  const jokers = cards["J"] || 0;

  delete cards["J"];

  const handCount = Object.values(cards).sort((a, b) => b - a);
  for (let i = 0; i < jokers; i++) {
    if (handCount.length === 0) {
      handCount.push(1);
      continue;
    }
    handCount[0] = handCount[0] + 1;
  }

  if (handCount.reduce((acc, count) => acc + count, 0) !== 5) {
    throw new Error(`Invalid hand ${hand}`);
  }

  const handString = handCount.join("");
  const handScore =
    handTypeValue[handString as keyof typeof handTypeValue] || 0;

  return handScore;
};
export const compare = (a: string, b: string): -1 | 0 | 1 => {
  if (a === b) return 0;
  const scoreA = getHandScore(a);
  const scoreB = getHandScore(b);
  return scoreA > scoreB ? 1 : -1;
};

const compareHandAt = (a: string, b: string, at: number): -1 | 0 | 1 => {
  const cardA = a[at];
  const cardB = b[at];
  if (cardA === cardB) {
    return 0;
  }
  return cardValue[cardA as keyof typeof cardValue] >
    cardValue[cardB as keyof typeof cardValue]
    ? 1
    : -1;
};
export const compareHand = (a: string, b: string): -1 | 0 | 1 => {
  let i = 0;
  let compare: -1 | 0 | 1 = 0;
  while ((compare = compareHandAt(a, b, i)) === 0) {
    i++;
  }

  return compare;
};
