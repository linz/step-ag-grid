import { wait } from '../utils/util';

export const waitForCondition = async (
  error: string,
  condition: () => boolean,
  timeoutMs: number,
): Promise<boolean> => {
  const endTime = Date.now() + timeoutMs;
  while (Date.now() < endTime) {
    if (condition()) {
      return true;
    }
    await wait(100);
  }
  console.warn(error);
  return false;
};
