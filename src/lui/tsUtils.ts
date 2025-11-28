export const typedKeys = <T extends object>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];

export const typedEntries = <T extends object>(obj: T): { [K in keyof T]-?: [K, T[K]] }[keyof T][] =>
  Object.entries(obj) as { [K in keyof T]-?: [K, T[K]] }[keyof T][];
