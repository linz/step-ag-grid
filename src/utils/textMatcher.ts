import { isEmpty } from "lodash-es";
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
 *
 * Returns ture if there's a text match.
 */
export const textMatch = (text: string | undefined | null, filter: string): boolean => {
  if (text == null) return true;

  const superFilters = filter
    .split(",")
    .map((sf) => sf.trim())
    .filter((sf) => sf);
  const values = text.replaceAll(",", " ").trim().split(/\s+/);
  return (
    isEmpty(superFilters) || // Not filtered
    superFilters.some((superFilter) => {
      const subFilters = superFilter.split(/\s+/).map((s) => s.replaceAll(/([!?])/g, "\\$1"));
      return subFilters.every((subFilter) => values.some((value) => isMatch(value, subFilter)));
    })
  );
};
