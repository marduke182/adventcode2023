import { open } from "fs/promises";

const bagDB: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

type Set = Record<string, number>;

interface Game {
  id: number;
  sets: Set[];
}

const parseGame = (line: string): Game => {
  const [game, other] = line.split(":");
  const setsString = other.split(";");
  const sets = setsString.map((set) => {
    const balls = set.split(",");
    return balls.reduce<Set>((acc, ball) => {
      const [amount, color] = ball.trim().split(" ");
      return {
        ...acc,
        [color]: Number(amount),
      };
    }, {});
  });

  const [, id] = game.split(" ");
  return {
    id: Number(id),
    sets,
  };
};

const isValidGame = (game: Game, bag: Record<string, number>): boolean => {
  return game.sets.every((set) =>
    Object.entries(set).every(([color, amount]) => {
      return bag[color] >= amount;
    }),
  );
};

const calcPower = (game: Game): number => {
  const minValues = game.sets.reduce((acc, set) => {
    Object.entries(set).forEach(([color, amount]) => {
      return (acc[color] = Math.max(acc[color] || Number.MIN_VALUE, amount));
    });
    return acc;
  }, {});

  return Object.values(minValues).reduce(
    (acc, v) => (acc === 0 ? v : acc * v),
    0,
  );
};

(async () => {
  const file = await open("./input.txt");
  let accP1 = 0;
  let accP2 = 0;
  for await (const line of file.readLines()) {
    const game = parseGame(line);
    const isValid = isValidGame(game, bagDB);
    if (isValid) {
      accP1 += game.id;
    }
    accP2 += calcPower(game);
  }
  console.log("Part 1", accP1);
  console.log("Part 2", accP2);
})();
