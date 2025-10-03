import { wait } from '../utils/util';

export const waitForCondition = async (condition: () => boolean, timeoutMs: number): Promise<boolean> => {
  const endTime = Date.now() + timeoutMs;
  while (Date.now() < endTime) {
    if (condition()) {
      return true;
    }
    await wait(100);
  }
  console.warn('waitForCondition failed');
  return false;
};
