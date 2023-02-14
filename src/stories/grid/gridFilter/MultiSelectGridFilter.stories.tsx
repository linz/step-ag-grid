import { useEffect, useState } from "react";

import { useGridFilter, GridFilter } from "components/GridFilter";
import { GridFilterRow } from "./GridFilter.stories";

export const MultiSelectGridFilter = () => {
  const [state, setState] = useState<{ Developer: boolean; Manager: boolean; Tester: boolean }>({
    Developer: false,
    Manager: false,
    Tester: false,
  });

  const gridFilter = useGridFilter<GridFilterRow>();

  const handleEvent = (target: HTMLInputElement) => {
    setState({
      ...state,
      [target.name]: target.checked,
    });
  };

  useEffect(() => {
    const filters = Object.keys(state)
      .filter((key) => (state as any)[key])
      .map((key) => key);

    if (filters.length > 0) {
      gridFilter.setFilters(GridFilter<GridFilterRow>().isAnyOf("position", ...filters));
    } else {
      gridFilter.resetFilters();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="button-group">
      <div className="positions">
        <div>
          <input
            id="Developer"
            name="Developer"
            onChange={({ target }) => handleEvent(target)}
            role="checkbox"
            type="checkbox"
          />
          <label htmlFor="Developer">Developer</label>
        </div>
        <div>
          <input
            id="Manager"
            name="Manager"
            onChange={({ target }) => handleEvent(target)}
            role="checkbox"
            type="checkbox"
          />
          <label htmlFor="Manager">Manager</label>
        </div>
        <div>
          <input
            id="Tester"
            name="Tester"
            onChange={({ target }) => handleEvent(target)}
            role="checkbox"
            type="checkbox"
          />
          <label htmlFor="Tester">Tester</label>
        </div>
      </div>
      <style>{`
      .positions {
          padding: 10px 0;
      }

      .positions label {
        font-weight: bolder;
        margin: 0 5px;
      }
      `}</style>
    </div>
  );
};
