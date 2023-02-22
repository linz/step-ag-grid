import clsx, { ClassValue } from "clsx";
import { useMemo, useState } from "react";

import { LuiButton, LuiButtonGroup } from "@linzjs/lui";
import { LuiButtonProps } from "@linzjs/lui/dist/components/LuiButton/LuiButton";

import { GridFilterExternal } from "../../contexts/GridContext";
import { GridBaseRow } from "../Grid";
import { useGridFilter } from "../GridFilter";

interface GridFilterButtonsOption<RowType extends GridBaseRow> {
  defaultSelected?: boolean;
  filter?: GridFilterExternal<RowType>;
  label: string;
}

export type GridFilterButtonsProps<RowType extends GridBaseRow> = {
  className?: ClassValue;
  luiButtonProps?: Partial<LuiButtonProps>;
  options: GridFilterButtonsOption<RowType>[];
};

export const GridFilterButtons = <RowType extends GridBaseRow>({
  className,
  luiButtonProps,
  options,
}: GridFilterButtonsProps<RowType>): JSX.Element => {
  // Select defaultSelected option, otherwise first option.  If no options select none.
  const [selectedOption, setSelectedOption] = useState(options.find((option) => option.defaultSelected) ?? options[0]);

  const filter = useMemo(() => selectedOption?.filter, [selectedOption]);
  useGridFilter(filter);

  return (
    <div className={clsx("lui-margin-top-xxs lui-margin-bottom-xxs", className)}>
      <LuiButtonGroup>
        {options.map((option, index) => (
          <LuiButton
            key={`${index}`}
            {...luiButtonProps}
            className={clsx(
              `lui-button lui-button-secondary`,
              selectedOption?.label === option.label && `lui-button-active`,
              luiButtonProps?.className,
            )}
            onClick={() => setSelectedOption(option)}
          >
            {option.label}
          </LuiButton>
        ))}
      </LuiButtonGroup>
    </div>
  );
};
