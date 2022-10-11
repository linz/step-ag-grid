import { isEmpty as _isEmpty } from "lodash-es";

// Typed version of lodash !isEmpty
export const isNotEmpty = (obj: Set<any> | Map<any, any> | Record<any, any> | any[] | undefined): boolean =>
  !_isEmpty(obj);

export const wait = (timeoutMs: number) =>
  new Promise<(string | null)[]>((resolve) => {
    setTimeout(resolve, timeoutMs);
  });
