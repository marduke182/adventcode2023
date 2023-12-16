import { open } from "fs/promises";

type Engine = string[];
type NumberCords = {
  x: number;
  y: number;
  length: number;
  number: number;
};

const getNumber = (char: string): number | null => {
  const maybeNumber = Number(char);
  if (Number.isNaN(maybeNumber)) {
    return null;
  }
  return maybeNumber;
};

const isSymbol = (char: string): boolean =>
  char !== "." && Number.isNaN(Number(char));

const findNumbersInEngine = (engine: string[]): NumberCords[] => {
  const xLength = engine.length;
  const yLength = engine[0].length;
  const numbers: NumberCords[] = [];

  for (let x = 0; x < xLength; x++) {
    let y = 0;

    while (y < yLength) {
      const maybeNumber = getNumber(engine[x][y]);

      if (maybeNumber === null) {
        y++;
        continue;
      }

      let numberEnd = y + 1;
      while (numberEnd < yLength && getNumber(engine[x][numberEnd]) !== null) {
        numberEnd++;
      }

      numberEnd = numberEnd === yLength ? numberEnd : numberEnd - 1;

      const numberString = engine[x].slice(y, numberEnd + 1);
      // console.log(x, y, numberEnd, numberString, maybeNumber);

      numbers.push({
        x,
        y,
        length: numberString.length,
        number: Number(numberString),
      });

      y = numberEnd + 1;
    }
  }

  return numbers;
};

const checkIfNumberIsValid = (engine: Engine, number: NumberCords): boolean => {
  const { x, y, length } = number;
  const xLength = engine.length;
  const yLength = engine[0].length;

  const top = x - 1 >= 0 ? x - 1 : 0;
  const bottom = x + 1 < xLength ? x + 1 : xLength - 1;
  const left = y - 1 >= 0 ? y - 1 : 0;
  const right = y + length < yLength ? y + length : yLength - 1;

  for (let i = top; i <= bottom; i++) {
    for (let j = left; j <= right; j++) {
      console.log(j);
      if (i === x && j >= y && j < y + length) {
        console.log(j, engine[i][j]);
        continue;
      }

      console.log(i, j, engine[i][j]);
      if (isSymbol(engine[i][j])) {
        return true;
      }
    }
  }

  return false;
};

(async () => {
  const file = await open("./input.txt");
  const engine: Engine = [];
  for await (const line of file.readLines()) {
    engine.push(line);
  }

  const acc = findNumbersInEngine(engine).reduce((acc, numberCords) => {
    if (checkIfNumberIsValid(engine, numberCords)) {
      return acc + numberCords.number;
    }
    return acc;
  }, 0);

  console.log("Part 1", acc);
})();
