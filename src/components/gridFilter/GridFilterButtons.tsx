import clsx, { ClassValue } from "clsx";
import { ReactElement, useMemo, useState } from "react";

import { LuiButton, LuiButtonGroup } from "@linzjs/lui";
import { LuiButtonProps } from "@linzjs/lui/dist/components/LuiButton/LuiButton";

import { GridFilterExternal } from "../../contexts/GridContext";
import { GridBaseRow } from "../Grid";
import { useGridFilter } from "./useGridFilter";

export interface GridFilterButtonsOption<TData extends GridBaseRow> {
  defaultSelected?: boolean;
  filter?: GridFilterExternal<TData>;
  label: string;
}

export type GridFilterButtonsProps<TData extends GridBaseRow> = {
  className?: ClassValue;
  luiButtonProps?: Partial<LuiButtonProps>;
  options: GridFilterButtonsOption<TData>[];
};

export const GridFilterButtons = <TData extends GridBaseRow>({
  className,
  luiButtonProps,
  options,
}: GridFilterButtonsProps<TData>): ReactElement => {
  // Select defaultSelected option, otherwise first option.  If no options select none.
  const [selectedOption, setSelectedOption] = useState(options.find((option) => option.defaultSelected) ?? options[0]);

  const filter = useMemo(() => selectedOption?.filter, [selectedOption]);
  useGridFilter(filter);

  return (
    <div className={clsx(className, "flex-col-center")}>
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
