import { GridFilter, useGridFilter } from "components/GridFilter";
import { useEffect, useState } from "react";
import { GridFilterRow } from "./GridFilter.stories";

type Position = "All" | "Developer" | "Manager" | "Tester";

export const BasicGridFilter = () => {
  const gridFilter = useGridFilter<GridFilterRow>();

  const [position, setPosition] = useState<Position>("All");

  useEffect(() => {
    if (position === "All") {
      gridFilter.resetFilters();
    } else {
      gridFilter.setFilters(GridFilter<GridFilterRow>().isEqual("position", position));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  return (
    <div>
      <select
        id="position"
        name="position"
        title="Position"
        className="lui-margin-top-xxs lui-margin-bottom-xxs"
        value={position}
        onChange={({ target }) => {
          const position = target.value as Position;
          setPosition(position);
        }}
      >
        <option>All</option>
        <option>Developer</option>
        <option>Manager</option>
        <option>Tester</option>
      </select>

      <style>
        {`
          select {
                width: 100%;
                height: 48px;
                border: 0.06rem solid #beb9b4;
                border-radius: 3px;
                padding-left: 0.75rem;
                padding-right: 0.75rem;
          }
        `}
      </style>
    </div>
  );
};
