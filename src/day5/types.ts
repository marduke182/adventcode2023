export interface Range {
  start: number;
  end: number;
}

export interface DB {
  seeds: number[];
  ranges: Record<string, RangeMapI>;
}

export interface RangeMapI {
  addRange(range: [number, number, number]): void;

  get(source: number, sourceRange?: number): number;

  getRanges(sourceRanges: Range[]): Range[];
}
