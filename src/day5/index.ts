import { setupDatabase } from "./utils";
import { DB, Range } from "./types";

const getLocation = (seed: number, db: DB) => {
  const soil = db.ranges!["seed-to-soil"].get(seed);
  const fertilizer = db.ranges!["soil-to-fertilizer"].get(soil);
  const water = db.ranges!["fertilizer-to-water"].get(fertilizer);
  const light = db.ranges!["water-to-light"].get(water);
  const temperature = db.ranges!["light-to-temperature"].get(light);
  const humidity = db.ranges!["temperature-to-humidity"].get(temperature);
  const location = db.ranges!["humidity-to-location"].get(humidity);

  return location;
};

const part1 = async () => {
  const db = await setupDatabase();
  if (!db) {
    throw new Error("Invalid database");
  }
  let lowestLocation = Number.MAX_VALUE;
  for (let i = 0; i < db.seeds.length; i++) {
    const seed = db.seeds[i];
    lowestLocation = Math.min(lowestLocation, getLocation(seed, db));
  }
  console.log("Part1 lowest location:", lowestLocation);
};

const getRangeLocation = (seed: Range, db: DB) => {
  const soil = db.ranges!["seed-to-soil"].getRanges([seed]);
  const fertilizer = db.ranges!["soil-to-fertilizer"].getRanges(soil);
  const water = db.ranges!["fertilizer-to-water"].getRanges(fertilizer);
  const light = db.ranges!["water-to-light"].getRanges(water);
  const temperature = db.ranges!["light-to-temperature"].getRanges(light);
  const humidity = db.ranges!["temperature-to-humidity"].getRanges(temperature);
  const location = db.ranges!["humidity-to-location"].getRanges(humidity);

  return location;
};

const getLowest = (ranges: Range[]): number => {
  let minRange = Number.MAX_VALUE;
  ranges.forEach((range) => {
    minRange = Math.min(minRange, range.start);
  });

  return minRange;
};

const part2 = async () => {
  const db = await setupDatabase();
  if (!db) {
    throw new Error("Invalid database");
  }
  let lowestLocation = Number.MAX_VALUE;
  for (let i = 0; i < db.seeds.length; i = i + 2) {
    const seedRange: Range = {
      start: db.seeds[i],
      end: db.seeds[i] + db.seeds[i + 1],
    };
    lowestLocation = Math.min(
      lowestLocation,
      getLowest(getRangeLocation(seedRange, db)),
    );
  }

  console.log(lowestLocation);
};

// part1();
part2();