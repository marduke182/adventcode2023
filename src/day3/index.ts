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

interface SymbolCords {
  x: number;
  y: number;
  symbol: string;
}

const findSymbolCloseToNumber = (
  engine: Engine,
  number: NumberCords,
): SymbolCords | null => {
  const { x, y, length } = number;
  const xLength = engine.length;
  const yLength = engine[0].length;

  const top = x - 1 >= 0 ? x - 1 : 0;
  const bottom = x + 1 < xLength ? x + 1 : xLength - 1;
  const left = y - 1 >= 0 ? y - 1 : 0;
  const right = y + length < yLength ? y + length : yLength - 1;

  for (let i = top; i <= bottom; i++) {
    for (let j = left; j <= right; j++) {
      if (i === x && j >= y && j < y + length) {
        continue;
      }

      if (isSymbol(engine[i][j])) {
        return {
          x: i,
          y: j,
          symbol: engine[i][j],
        };
      }
    }
  }

  return null;
};

(async () => {
  const file = await open("./input.txt");
  const engine: Engine = [];
  for await (const line of file.readLines()) {
    engine.push(line);
  }

  const cords = findNumbersInEngine(engine);

  // Part 1 - Find numbers
  let acc = 0
  cords.forEach((numberCords) => {
    const symbolCords = findSymbolCloseToNumber(engine, numberCords);
    if (symbolCords == null) {
      return;
    }

    acc += numberCords.number;

  }, 0);

  // Part 2 - Find gears
  const gears: Record<string, NumberCords[]> = {};
  cords.forEach((numberCords) => {
    const symbolCords = findSymbolCloseToNumber(engine, numberCords);
    if (!symbolCords || symbolCords.symbol !== "*") {
      return;
    }

    const { x, y } = symbolCords;
    const gearCords = `${x},${y}`;
    if (gears[gearCords] == null) {
      gears[gearCords] = [];
    }

    gears[gearCords].push(numberCords);
  }, 0);

  const gearRatiosSum = Object.values(gears).reduce((acc, gear) => {
    const [gear1, gear2] = gear;
    if (gear1 != undefined && gear2 != undefined) {
      return acc + gear1.number * gear2.number;
    }
    return acc;
  }, 0);

  console.log("Part 1", acc);
  console.log("Part 2", gearRatiosSum);
})();
