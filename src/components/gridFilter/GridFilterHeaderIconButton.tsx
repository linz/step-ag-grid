import { ButtonHTMLAttributes, MouseEvent, forwardRef } from "react";

import { LuiButton, LuiIcon } from "@linzjs/lui";
import { IconName, IconSize } from "@linzjs/lui/dist/components/LuiIcon/LuiIcon";

export interface GridFilterHeaderIconButtonProps {
  icon: IconName;
  onClick?: (e: MouseEvent) => void;
  buttonProps?: Partial<ButtonHTMLAttributes<HTMLButtonElement>>;
  disabled?: boolean;
  size?: IconSize;
  title: string;
}

export const GridFilterHeaderIconButton = forwardRef<HTMLButtonElement, GridFilterHeaderIconButtonProps>(
  function columnsButton({ icon, title, onClick, buttonProps, disabled = false, size = "md" }, ref) {
    return (
      <LuiButton
        {...buttonProps}
        type={"button"}
        level={"tertiary"}
        className={"lui-button-icon-only"}
        ref={ref}
        aria-label={title}
        title={title}
        onClick={onClick}
        disabled={disabled}
      >
        <LuiIcon name={icon} alt={"Menu"} size={size} />
      </LuiButton>
    );
  },
);
