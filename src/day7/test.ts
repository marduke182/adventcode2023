import { compare } from "./utils";

describe("compare", () => {
  it("should return 0 when they are equal", () => {
    expect(compare("33333", "33333")).toEqual(0);
  });

  it("should 5 equal be grater than 4 equal", () => {
    expect(compare("33333", "33332")).toEqual(1);
  });

  it("should 4 equal be greater than full house", () => {
    expect(compare("33332", "33322")).toEqual(1);
  });

  it("should full house be greater than 3 equal", () => {
    expect(compare("33322", "33324")).toEqual(1);
  });

  it("should 3 equal be greater than 2 pairs", () => {
    expect(compare("33324", "33422")).toEqual(1);
  });

  it("should 2 pairs be greater than 1 pair", () => {
    expect(compare("33422", "33245")).toEqual(1);
  });

  it("should 1 pair be greater than nothing", () => {
    expect(compare("22345", "23456")).toEqual(1);
  });

});
