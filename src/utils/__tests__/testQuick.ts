/**
 * General query all by selected.  Internal use, use quick operations instead.
 *
 * @param selector Selector to use
 * @param container Optional container
 * @return HTMLElement array
 */
import { IconName } from '@linzjs/lui/dist/components/LuiIcon/LuiIcon';

import { wait } from '../util';

const queryAllBySelector = <T extends HTMLElement>(selector: string, container: HTMLElement = document.body): T[] =>
  Array.from(container.querySelectorAll<T>(selector));

/**
 * Filters for query quick operations.
 */
export interface IQueryQuick {
  testId?: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  tagName?: 'button' | 'span' | 'div' | 'input' | 'textarea' | any;
  text?: string | RegExp;
  icon?: IconName;
  ariaLabel?: string;
  role?: string;
  classes?: string;
  child?: IQueryQuick;
  selector?: string;
}

const escapeSelectorParam = (param: string): string => param.replace(/["\\]/g, '\\$&');

export const getMatcher = (matcherText: string | RegExp) => {
  const textMatcher =
    typeof matcherText === 'string'
      ? (text?: string) => text != null && text.toLowerCase() === matcherText.toLowerCase()
      : (text?: string) => text != null && matcherText.test(text);
  return (e: HTMLElement) => textMatcher(e.innerHTML?.trim()) || textMatcher(e.innerText?.trim());
};

/**
 * Build selector for quick operations.
 *
 * @param props Filters to convert to selector.
 * @param container Optional container to search in.
 */
const quickSelector = <T extends HTMLElement>(
  props: IQueryQuick,
  container?: HTMLElement,
): { selector: string; els: T[] } => {
  let selector = '';
  let lastIQueryQuick = props;
  for (let loop: IQueryQuick | undefined = props; loop; loop = loop.child) {
    lastIQueryQuick = loop;
    loop.selector && (selector += loop.selector);
    loop.tagName && (selector += loop.tagName);
    loop.ariaLabel && (selector += `[aria-label='${escapeSelectorParam(loop.ariaLabel)}']`);
    loop.role && (selector += `[role="${escapeSelectorParam(loop.role)}"]`);
    loop.testId && (selector += `[data-testid="${escapeSelectorParam(loop.testId)}"]`);
    loop.icon && (selector += `[data-icon='${loop.icon}']`);
    loop.classes && (selector += loop.classes);
    selector += ' ';
  }

  if (selector.trim() == '') {
    throw 'get/query/findQuick needs at least one defined parameter';
  }

  let els = queryAllBySelector<T>(selector, container);

  if (lastIQueryQuick.text != null) {
    const matcher = getMatcher(lastIQueryQuick.text);
    els = els.filter(matcher);
  }

  return {
    selector: [
      selector,
      typeof lastIQueryQuick.text === 'string' ? JSON.stringify(lastIQueryQuick.text) : lastIQueryQuick.text,
    ]
      .filter((r) => r)
      .join(' '),
    els,
  };
};

/**
 * Query by filter.
 *
 * @param filter Filter
 * @param container Optional container to look in
 * @return HTMLElement if found else null
 */
export const queryQuick = <T extends HTMLElement>(filter: IQueryQuick, container?: HTMLElement): T | null => {
  const { els, selector } = quickSelector<T>(filter, container);
  if (els.length > 1) {
    throw `Found multiple(${els.length}) elements by selector ${selector}\n${els
      .map((el, index) => `${index}: ${el.parentElement?.innerHTML}\n\n`)
      .join()}`;
  }
  return els[0] ?? null;
};

/**
 * Query all by filter.
 *
 * @param filter Filter
 * @param container Optional container to look in
 * @return HTMLElement array
 */
export const queryAllQuick = <T extends HTMLElement>(filter: IQueryQuick, container?: HTMLElement): T[] =>
  quickSelector<T>(filter, container)?.els;

/**
 * Get all by filter.
 *
 * @param filter Filter
 * @param container Optional container to look in
 * @return HTMLElement array.  Throws exception if nothing is found.
 */
export const getAllQuick = <T extends HTMLElement>(filter: IQueryQuick, container?: HTMLElement): T[] => {
  const els = queryAllQuick(filter, container);
  if (els.length == 0) {
    throw Error(`getAllQuick not found, selector: ${quickSelector(filter).selector}`);
  }
  return els as T[];
};

/**
 * Get by filter.
 *
 * @param filter Filter
 * @param container Optional container to look in
 * @return HTMLElement.  Throws exception if not found.
 */
export const getQuick = (filter: IQueryQuick, container?: HTMLElement): HTMLElement => {
  const el = queryQuick(filter, container);
  if (el == null) {
    throw Error(`getQuick  not found, selector: ${quickSelector(filter).selector}`);
  }
  return el;
};

/**
 * Find by filter.  Waits up to 5 seconds to find filter.
 *
 * @param filter Filter
 * @param container Optional container to look in
 * @return HTMLElement.  Throws exception if not found.
 */
export const findQuick = async <T extends HTMLElement>(filter: IQueryQuick, container?: HTMLElement): Promise<T> => {
  const endTime = Date.now() + 1000;
  while (Date.now() < endTime) {
    const el = queryQuick<T>(filter, container);
    if (el) return el;
    await wait(50);
  }
  throw Error(`findQuick not found, selector: ${quickSelector(filter).selector}`);
};
