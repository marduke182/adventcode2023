import { rangeInterception, substractRange, substractRanges } from "./utils";

describe("Range Interceptor", () => {
  it("should intercept when is contained", () => {
    expect(
      rangeInterception({ start: 0, end: 10 }, { start: 1, end: 9 }),
    ).toEqual({ start: 1, end: 9 });
  });

  it("should intercept when is partially contained at the beginning", () => {
    expect(
        rangeInterception({ start: 5, end: 10 }, { start: 1, end: 9 }),
    ).toEqual({ start: 5, end: 9 });
  });

  it("should intercept when is partially contained at the end", () => {
    expect(
        rangeInterception({ start: 0, end: 5 }, { start: 1, end: 9 }),
    ).toEqual({ start: 1, end: 5 });
  });
});

describe('substractRange', () => {
  it('should substract when match above', () => {
    expect(
        substractRange({ start: 0, end: 10 }, { start: 0, end: 5 }),
    ).toEqual([{ start: 6, end: 10 }]);
  });

  it('should substract when match below', () => {
    expect(
        substractRange({ start: 0, end: 10 }, { start: 5, end: 10 }),
    ).toEqual([{ start: 0, end: 4 }]);
  });

  it('should substract when match middle', () => {
    expect(
        substractRange({ start: 0, end: 10 }, { start: 3, end: 6 }),
    ).toEqual([{ start: 0, end: 2 }, { start: 7, end: 10 }]);
  });

  it('should the original range when the substract is outside', () => {
    expect(
        substractRange({ start: 0, end: 10 }, { start: 11, end: 15 }),
    ).toEqual([{ start: 0, end: 10 }]);
  });

  it('should is the same range should return empty', () => {
    expect(
        substractRange({ start: 0, end: 10 }, { start: 0, end: 10 }),
    ).toEqual([]);
  });
});

describe('substractRanges', () => {
  it('should return empty when match the whole ranges', () => {
    expect(
      substractRanges([{ start: 0, end: 10 }, { start: 20, end: 30 }], { start: 0, end: 30 }),
    ).toEqual([]);
  });

  it('should return original ranges when no match', () => {
    expect(
      substractRanges([{ start: 0, end: 10 }, { start: 20, end: 30 }], { start: 11, end: 19 }),
    ).toEqual([{ start: 0, end: 10 }, { start: 20, end: 30 }]);
  });

  it('should substract from both ranges when it match boths', () => {
    expect(
        substractRanges([{ start: 0, end: 10 }, { start: 20, end: 30 }], { start: 5, end: 25 }),
    ).toEqual([{ start: 0, end: 4 }, { start: 26, end: 30 }]);
  });

  it('should substract from one range when it matche', () => {
    expect(
        substractRanges([{ start: 0, end: 10 }, { start: 20, end: 30 }], { start: 5, end: 19 }),
    ).toEqual([{ start: 0, end: 4 }, { start: 20, end: 30 }]);
  });

});