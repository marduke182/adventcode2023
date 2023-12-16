import { open } from "fs/promises";

const spelledNumbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

type SpelledBNumberDB = Record<string, string[]>;

const rightNumbersDB = spelledNumbers.reduce<SpelledBNumberDB>((acc, n) => {
  const char = n[n.length - 1];

  if (acc[char]) {
    return {
      ...acc,
      [char]: [...acc[char], n],
    };
  }
  return {
    ...acc,
    [char]: [n],
  };
}, {});

const leftNumbersDB = spelledNumbers.reduce<SpelledBNumberDB>((acc, n) => {
  const char = n[0];

  if (acc[char]) {
    return {
      ...acc,
      [char]: [...acc[char], n],
    };
  }
  return {
    ...acc,
    [char]: [n],
  };
}, {});

const findNumber = (
  line: string,
  pos: number,
  db: SpelledBNumberDB,
  dir: -1 | 1,
): number | null => {
  const char = line[pos];
  const maybeNumber = Number(char);

  if (!Number.isNaN(maybeNumber)) {
    return maybeNumber;
  }

  const spelled = db[char];
  if (!spelled) {
    return null;
  }

  const number = spelled.find((spelledNumber) => {
    const length = spelledNumber.length;
    const world =
      dir === 1
        ? line.slice(pos - length + 1, pos + 1)
        : line.slice(pos, pos + length);
    if (world === spelledNumber) {
      return true;
    }
    return false;
  });

  if (number) {
    return spelledNumbers.indexOf(number) + 1;
  }

  return null;
};
const getCalibrationValue = (line: string) => {
  const length = line.length;
  let left = 0;
  let right = length - 1;
  let tens = -1;
  let ones = -1;

  while (left <= length && right >= 0 && (tens === -1 || ones === -1)) {
    // Left iterator
    if (tens === -1) {
      const leftValueN = findNumber(line, left, leftNumbersDB, -1);
      if (leftValueN != null) {
        tens = leftValueN * 10;
        continue;
      }
      left++;
    }

    // Right iterator
    if (ones === -1) {
      const rightValueN = findNumber(line, right, rightNumbersDB, 1);
      if (rightValueN != null) {
        ones = rightValueN;
      }

      right--;
    }
  }

  if (tens === -1 && ones === -1) {
    throw new Error("Invalid line");
  }

  return tens + ones;
};

(async () => {
  const file = await open("./input.txt");
  let acc = 0;
  for await (const line of file.readLines()) {
    const lineCB = getCalibrationValue(line);
    acc += lineCB;
  }
  console.log(acc);
})();
