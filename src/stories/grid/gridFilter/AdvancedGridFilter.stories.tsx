import clsx from "clsx";
import { LuiButton, LuiButtonGroup } from "@linzjs/lui";
import { GridFilter, useGridFilter } from "components/GridFilter";
import { useEffect, useState } from "react";
import { GridFilterRow } from "./GridFilter.stories";

type Position = "All" | "Developer" | "Manager" | "Tester";

export const AdvancedGridFilter = () => {
  const gridFilter = useGridFilter<GridFilterRow>();

  const [age, setAge] = useState(0);
  const [state, setState] = useState<{ age?: number; position: Position }>({ position: "All" });

  useEffect(() => {
    const { age, position } = state;

    const filters = GridFilter<GridFilterRow>()
      .addFilter((row) => (position === "All" ? true : row.position === position))
      .addFilter((row) => (age === undefined || age <= 0 ? true : row.age <= age));

    gridFilter.setFilters(filters);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div>
      <div className="lui-margin-top-xxs lui-margin-bottom-xxs">
        <LuiButtonGroup>
          <LuiButton
            className={clsx(`lui-button lui-button-secondary`, state.position === "All" ? `lui-button-active` : "")}
            onClick={() => {
              setState({
                ...state,
                position: "All",
              });
            }}
          >
            All
          </LuiButton>
          <LuiButton
            className={clsx(
              `lui-button lui-button-secondary`,
              state.position === "Developer" ? `lui-button-active` : "",
            )}
            onClick={() => {
              setState({
                ...state,
                position: "Developer",
              });
            }}
          >
            Developer
          </LuiButton>
          <LuiButton
            className={clsx(`lui-button lui-button-secondary`, state.position === "Manager" ? `lui-button-active` : "")}
            onClick={() => {
              setState({
                ...state,
                position: "Manager",
              });
            }}
          >
            Manager
          </LuiButton>
          <LuiButton
            className={clsx(`lui-button lui-button-secondary`, state.position === "Tester" ? `lui-button-active` : "")}
            onClick={() => {
              setState({
                ...state,
                position: "Tester",
              });
            }}
          >
            Tester
          </LuiButton>
        </LuiButtonGroup>
      </div>

      <input
        className="lui-margin-top-xxs lui-margin-bottom-xxs"
        type="number"
        placeholder="Age (<=) [press enter (↵) to filter]"
        name="age"
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            setState({
              ...state,
              age,
            });
          }
        }}
        onChange={({ target }) => {
          setAge(Number(target.value));
        }}
      />

      <style>
        {`
          input[name="age"] {
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
