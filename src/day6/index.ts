import { open } from "fs/promises";

interface Run {
  time: number;
  distance: number;
}

const parseFile = async (): Promise<Run[]> => {
  const file = await open("./input.txt");
  const times: number[] = [];
  const distances: number[] = [];

  for await (const line of file.readLines()) {
    if (line.includes("Time:")) {
      line
        .split(":")[1]
        .split(" ")
        .filter((v) => v.trim() != "")
        .map(Number)
        .forEach((v) => times.push(v));
    }
    if (line.includes("Distance:")) {
      line
        .split(":")[1]
        .split(" ")
        .filter((v) => v.trim() != "")
        .map(Number)
        .forEach((v) => distances.push(v));
    }
  }
  return times.map((time, i) => {
    return {
      time,
      distance: distances[i],
    };
  });
};

const ACCELERATION = 1;
const initialSpeed = 0;

const calcSpeed = (time: number): number => {
  return initialSpeed + ACCELERATION * time;
};

const part1 = async () => {
  const run = await parseFile();
  const beatRecords = [];
  // Race
  for (let i = 0; i < run.length; i++) {
    const { time: maxTime, distance: goal } = run[i];
    let beatRecordTimes = 0;

    for (let j = 0; j < maxTime; j++) {
      const speed = calcSpeed(j);
      const distance = speed * (maxTime - j);
      if (distance >= goal) {
        beatRecordTimes++;
      }
    }

    beatRecords.push(beatRecordTimes);
  }
  console.log(beatRecords.reduce((acc, v) => acc * v, 1));
};

const parseFile2 = async (): Promise<Run> => {
  const file = await open("./input.txt");
  let time: number = -1;
  let distance: number = -1;

  for await (const line of file.readLines()) {
    if (line.includes("Time:")) {
      time = Number(line.split(":")[1].replace(/\s+/gm, "").trim());
    }
    if (line.includes("Distance:")) {
      distance = Number(line.split(":")[1].replace(/\s+/gm, "").trim());
    }
  }

  return {
    time,
    distance,
  };
};

const part2 = async () => {
  const run = await parseFile2();

  const beatRecords = [];
  // Race
  // for (let i = 0; i < run.length; i++) {
  const { time: maxTime, distance: goal } = run;
  let beatRecordTimes = 0;

  for (let j = 0; j < maxTime; j++) {
    const speed = calcSpeed(j);
    const distance = speed * (maxTime - j);
    if (distance >= goal) {
      beatRecordTimes++;
    }
  }

  beatRecords.push(beatRecordTimes);
  // }
  console.log(beatRecords.reduce((acc, v) => acc * v, 1));
};

part1();

part2();
