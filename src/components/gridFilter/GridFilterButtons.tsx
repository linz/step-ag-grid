import clsx from "clsx";
import { useMemo, useState } from "react";

import { LuiButton, LuiButtonGroup } from "@linzjs/lui";
import { GridFilterExternal } from "../../contexts/GridContext";
import { useGridFilter } from "../GridFilter";
import { GridBaseRow } from "../Grid";

interface GridFilterButtonsOption<RowType extends GridBaseRow> {
  defaultSelected?: boolean;
  filter?: GridFilterExternal<RowType>;
  label: string;
}

export type GridFilterButtonsProps<RowType extends GridBaseRow> = {
  options: GridFilterButtonsOption<RowType>[];
};

export const GridFilterButtons = <RowType extends GridBaseRow>({
  options,
}: GridFilterButtonsProps<RowType>): JSX.Element => {
  const [selectedOption, setSelectedOption] = useState(options.find((option) => option.defaultSelected) ?? options[0]);

  const filter = useMemo(() => selectedOption?.filter, [selectedOption]);
  useGridFilter(filter);

  return (
    <div className="lui-margin-top-xxs lui-margin-bottom-xxs">
      <LuiButtonGroup>
        {options.map((option, index) => (
          <LuiButton
            key={`${index}`}
            className={clsx(
              `lui-button lui-button-secondary`,
              selectedOption?.label === option.label && `lui-button-active`,
            )}
            style={{ whiteSpace: "nowrap" }}
            onClick={() => {
              setSelectedOption(option);
            }}
          >
            {option.label}
          </LuiButton>
        ))}
      </LuiButtonGroup>
    </div>
  );
};
