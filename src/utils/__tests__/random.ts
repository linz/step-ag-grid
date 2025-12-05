export class SeededRandomForTests {
  value: number;
  constructor(seed: number) {
    this.value = seed % 2147483647;
  }

  next(maxInc?: number) {
    this.value = (this.value * 16807) % 2147483647;
    const result = (this.value - 1) / 2147483646;
    if (maxInc == null) {
      return result;
    }
    return ((result * (maxInc + 1)) | 0) % (maxInc + 1);
  }

  fromArray<T>(arr: T[]): T {
    return arr[this.next(arr.length - 1)];
  }
}
