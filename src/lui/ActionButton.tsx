import "./ActionButton.scss";

import clsx from "clsx";
import { useEffect } from "react";
import { LuiButton, LuiIcon, LuiMiniSpinner } from "@linzjs/lui";
import { IconName } from "@linzjs/lui/dist/components/LuiIcon/LuiIcon";
import { usePrevious } from "./reactUtils";
import { useStateDeferred } from "./stateDeferredHook";

export interface ActionButtonProps {
  icon: IconName;
  name: string;
  inProgressName?: string;
  title?: string;
  dataTestId?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "ns";
  className?: string;
  onClick?: () => void;
  inProgress?: boolean;
}

// Kept this less than one second, so I don't have issues with waitFor as it defaults to 1s
const minimumInProgressTimeMs = 950;

export const ActionButton = ({
  icon,
  name,
  inProgressName,
  dataTestId,
  inProgress,
  className,
  title,
  onClick,
  size = "sm",
}: ActionButtonProps): JSX.Element => {
  const lastInProgress = usePrevious(inProgress ?? false);
  const [localInProgress, setLocalInProgress, setLocalInProgressDeferred] = useStateDeferred<boolean>(!!inProgress);

  useEffect(() => {
    if (inProgress == lastInProgress) return;
    inProgress ? setLocalInProgress(true) : setLocalInProgressDeferred(false, minimumInProgressTimeMs);
  }, [inProgress, lastInProgress, setLocalInProgress, setLocalInProgressDeferred]);

  return (
    <LuiButton
      data-testid={dataTestId}
      type={"button"}
      level={"tertiary"}
      title={title ?? name}
      aria-label={name}
      className={clsx("lui-button-icon", "ActionButton", className, localInProgress && "ActionButton-inProgress")}
      size={"lg"}
      onClick={onClick}
      disabled={localInProgress}
    >
      {localInProgress ? (
        <LuiMiniSpinner
          size={16}
          divProps={{
            "data-testid": "loading-spinner",
            style: { padding: 0, margin: 0, paddingRight: 8 },
            role: "status",
            ["aria-label"]: "Loading",
          }}
        />
      ) : (
        <LuiIcon name={icon} alt={name} size={size} />
      )}
      <span className={"ActionButton-minimalArea"}>
        <span className={"ActionButton-minimalAreaDisplay"}>{(localInProgress ? inProgressName : name) ?? name}</span>
        {/* This makes sure the button expands to fill maximum length text at all times */}
        <span className={"ActionButton-minimalAreaExpand"}>{name}</span>
      </span>
    </LuiButton>
  );
};