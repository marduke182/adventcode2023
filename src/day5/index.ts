import { open } from "fs/promises";

const parseLine = (line: string): string => {
  return line;
};
(async () => {
  const file = await open("./input.txt");

  for await (const line of file.readLines()) {
    parseLine(line);
  }
})();
