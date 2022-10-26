import { IconName } from "@linzjs/lui/dist/components/LuiIcon/LuiIcon";
import { LuiIcon } from "@linzjs/lui";

export const GridIcon = (props: { icon: IconName; title: string }): JSX.Element => (
  <LuiIcon
    name={props.icon}
    title={props.title}
    alt={props.title}
    size={"md"}
    className={`AgGridGenericCellRenderer-${props.icon}Icon`}
  />
);
