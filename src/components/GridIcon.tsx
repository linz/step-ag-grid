import clsx from "clsx";
import { LuiIcon } from "@linzjs/lui";
import { IconName, IconSize } from "@linzjs/lui/dist/components/LuiIcon/LuiIcon";

export const GridIcon = (props: {
  icon: IconName;
  title: string;
  size?: IconSize;
  disabled?: boolean;
  className?: string;
}): JSX.Element => (
  <LuiIcon
    name={props.icon}
    title={props.title}
    alt={props.title}
    size={props.size ?? "md"}
    className={clsx(
      `AgGridGenericCellRenderer-${props.icon}Icon`,
      props.className,
      props.disabled && "GridIcon-disabled",
    )}
  />
);
