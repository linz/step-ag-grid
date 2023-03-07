import { ButtonHTMLAttributes, MouseEventHandler, forwardRef } from "react";

import { LuiIcon } from "@linzjs/lui";
import { IconName, IconSize } from "@linzjs/lui/dist/components/LuiIcon/LuiIcon";

import "./GridFilterHeaderIconButton.scss";

export interface GridFilterHeaderIconButtonProps {
  icon: IconName;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  buttonProps?: Partial<ButtonHTMLAttributes<HTMLButtonElement>>;
  disabled?: boolean;
  size?: IconSize;
}

export const GridFilterHeaderIconButton = forwardRef<HTMLButtonElement, GridFilterHeaderIconButtonProps>(
  function columnsButton({ icon, onClick, buttonProps, disabled = false, size = "md" }, ref) {
    return (
      <button
        {...buttonProps}
        type={"button"}
        className={"GridFilterHeaderIconButton"}
        ref={ref}
        aria-label="More actions"
        title={"More actions"}
        onClick={onClick}
        disabled={disabled}
      >
        <LuiIcon name={icon} alt={"Menu"} size={size} />
      </button>
    );
  },
);
