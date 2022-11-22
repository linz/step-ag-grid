import { isEmpty, partition } from "lodash-es";
import { isMatch } from "matcher";

/**
 * Text matching with wildcards and multiple matchers.
 *
 * "L" => L*
 * "L*" => L*
 * "*L*" => *L*
 * "*L" => *L
 * "A B" => A* and B*
 * "A B, C" => (A* and B*) or C*
 * "!A" => all values must not match A
 * Returns true if there's a text match.
 */
export const textMatch = (text: string | undefined | null, filter: string): boolean => {
  if (text == null) return true;

  const superFilters = filter
    .split(",")
    .map((sf) => sf.trim())
    .filter((sf) => sf);
  const [negativeFilters, positiveFilters] = partition(superFilters, (superFilters) => superFilters.startsWith("!"));
  const values = text.replaceAll(",", " ").trim().split(/\s+/);
  return (
    (isEmpty(positiveFilters) || // Not filtered
      positiveFilters.some((superFilter) => {
        const subFilters = superFilter.split(/\s+/).map((s) => s.replaceAll(/([!?])/g, "\\$1"));
        return subFilters.every((subFilter) => values.some((value) => isMatch(value, subFilter)));
      })) &&
    (isEmpty(negativeFilters) ||
      negativeFilters.every((superFilter) => values.every((value) => isMatch(value, superFilter))))
  );
};
