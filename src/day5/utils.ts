import type { Range, DB, RangeMapI } from "./types";
import { open } from "fs/promises";

export const substractRange = (range: Range, substract: Range): Range[] => {
  if (range.start > substract.end || range.end < substract.start) {
    return [range];
  }

  // In the middle
  if (range.start < substract.start && range.end > substract.end) {
    return [
      {
        start: range.start,
        end: substract.start - 1,
      },
      {
        start: substract.end + 1,
        end: range.end,
      },
    ];
  }

  // if below
  if (range.end > substract.end) {
    return [{
      start: substract.end + 1,
      end: range.end,
    }];
  }

  // if above
  if (range.start < substract.start) {
    return [{
      start: range.start,
      end: substract.start - 1,
    }];
  }

  // is the same
    return [];
}

export const substractRanges = (ranges: Range[], substract: Range): Range[] => {
  const newRanges: Range[] = [];
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const newRange = substractRange(range, substract);
    newRanges.push(...newRange);
  }
  return newRanges;
}

export const rangeInterception = (a: Range, b: Range): Range | null => {
  if (a.start > b.end || b.start > a.end) {
    return null;
  }

  const start = Math.max(a.start, b.start);
  const end = Math.min(a.end, b.end);

  return {
    start,
    end,
  };
};

class RangeMap implements RangeMapI {
  private ranges: [number, number, number][] = [];

  addRange(range: [number, number, number]) {
    if (range.length !== 3) {
      console.log(range);
      throw new Error("Range must be of length 3");
    }

    this.ranges.push(range);
  }

  getRanges(sourceRanges: Range[]): Range[] {
    // Create a list of all destination ranges that intercept with the source range
    const destinationInterceptionRanges: Range[] = [];
    for (let j = 0; j < sourceRanges.length; j++) {
      const sourceRange = sourceRanges[j];
      let notInterceptedRanges: Range[] = [sourceRange];
      for (let i = 0; i < this.ranges.length; i++) {
        const [destinationStart, sourceStart, dbRange] = this.ranges[i];
        const dbSourceRange: Range = {
          start: sourceStart,
          end: sourceStart + dbRange - 1,
        };
        const interceptRange = rangeInterception(sourceRange, dbSourceRange);
        if (!interceptRange) {
          continue;
        }
        const destinationRange = {
          start: destinationStart + (interceptRange.start - sourceStart),
          end: destinationStart + (interceptRange.end - sourceStart),
        };
        notInterceptedRanges = substractRanges(notInterceptedRanges, interceptRange);
        destinationInterceptionRanges.push(destinationRange);
      }

      destinationInterceptionRanges.push(...notInterceptedRanges);
    }
    if (destinationInterceptionRanges.length === 0) {
      return sourceRanges;
    }

    return destinationInterceptionRanges;
  }

  get(source: number): number {
    const ranges = this.getRanges([{ start: source, end: source }]);
    if (ranges.length === 0) {
      throw new Error("No ranges found");
    }
    return ranges[0].start;
  }

  print() {
    console.log(this.ranges);
  }
}
export const setupDatabase = async (): Promise<DB | null> => {
  const file = await open("./input.txt");
  let currentRange = null;
  const ranges: Record<string, RangeMap> = {
    ["seed-to-soil"]: new RangeMap(),
    ["soil-to-fertilizer"]: new RangeMap(),
    ["fertilizer-to-water"]: new RangeMap(),
    ["water-to-light"]: new RangeMap(),
    ["light-to-temperature"]: new RangeMap(),
    ["temperature-to-humidity"]: new RangeMap(),
    ["humidity-to-location"]: new RangeMap(),
  };
  let seeds: null | number[] = null;

  for await (const line of file.readLines()) {
    if (line.includes("seeds:")) {
      seeds = line
        .split(":")[1]
        .split(" ")
        .filter((v) => v.trim() != "")
        .map(Number);
    }
    if (line.trim() == "") {
      continue;
    }
    if (line.includes("seed-to-soil")) {
      currentRange = "seed-to-soil";
      continue;
    }
    if (line.includes("soil-to-fertilizer")) {
      currentRange = "soil-to-fertilizer";
      continue;
    }
    if (line.includes("fertilizer-to-water")) {
      currentRange = "fertilizer-to-water";
      continue;
    }
    if (line.includes("water-to-light")) {
      currentRange = "water-to-light";
      continue;
    }
    if (line.includes("light-to-temperature")) {
      currentRange = "light-to-temperature";
      continue;
    }
    if (line.includes("temperature-to-humidity")) {
      currentRange = "temperature-to-humidity";
      continue;
    }
    if (line.includes("humidity-to-location")) {
      currentRange = "humidity-to-location";
      continue;
    }

    // we should be reading a range entry
    if (currentRange && ranges[currentRange] != null) {
      ranges[currentRange].addRange(
        line
          .split(" ")
          .filter((v) => v.trim() != "")
          .map(Number) as unknown as [number, number, number],
      );
    }
  }
  if (!seeds) {
    return null;
  }

  return {
    seeds,
    ranges,
  };
};
