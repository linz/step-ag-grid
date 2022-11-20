import "./ActionButton.scss";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { LuiButton, LuiIcon, LuiMiniSpinner } from "@linzjs/lui";
import { IconName } from "@linzjs/lui/dist/components/LuiIcon/LuiIcon";
import { usePrevious } from "./reactUtils";
import { useStateDeferred } from "./stateDeferredHook";
import { LuiButtonProps } from "@linzjs/lui/dist/components/LuiButton/LuiButton";

export interface ActionButtonProps {
  icon: IconName;
  name?: string;
  "aria-label"?: string;
  inProgressName?: string;
  title?: string;
  dataTestId?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "ns";
  iconPosition?: "left" | "right";
  className?: "ActionButton-fill" | string;
  onAction: () => Promise<void> | void;
  // Used for external code to get access to whether action is in progress
  externalSetInProgress?: () => void;
  level?: LuiButtonProps["level"];
  style?: React.CSSProperties;
}

// Kept this less than one second, so I don't have issues with waitFor as it defaults to 1s
const minimumInProgressTimeMs = 950;

export const ActionButton = ({
  icon,
  name,
  inProgressName,
  dataTestId,
  style,
  className,
  title,
  onAction,
  externalSetInProgress,
  size = "sm",
  iconPosition = "left",
  level = "tertiary",
  "aria-label": ariaLabel,
}: ActionButtonProps): JSX.Element => {
  const [inProgress, setInProgress] = useState(false);
  const lastInProgress = usePrevious(inProgress ?? false);
  const [localInProgress, setLocalInProgress, setLocalInProgressDeferred] = useStateDeferred<boolean>(inProgress);

  useEffect(() => {
    if (inProgress == lastInProgress) return;
    inProgress ? setLocalInProgress(true) : setLocalInProgressDeferred(false, minimumInProgressTimeMs);
  }, [inProgress, lastInProgress, setLocalInProgress, setLocalInProgressDeferred]);

  const buttonText = (
    <span className={"ActionButton-minimalArea"}>
      <span className={"ActionButton-minimalAreaDisplay"}>{(localInProgress ? inProgressName : name) ?? name}</span>
      {/* This makes sure the button expands to fill maximum length text at all times */}
      <span className={"ActionButton-minimalAreaExpand"}>{name}</span>
    </span>
  );

  return (
    <LuiButton
      data-testid={dataTestId}
      type={"button"}
      level={level}
      title={title ?? ariaLabel ?? name}
      aria-label={ariaLabel ?? name}
      className={clsx(
        "lui-button-icon-right",
        "ActionButton",
        className,
        localInProgress && "ActionButton-inProgress",
        name != null && !className?.includes("ActionButton-fill") && "ActionButton-minimal",
      )}
      size={"lg"}
      style={{ ...(name == null && { padding: "8px 5px" }), ...style }}
      onClick={async () => {
        const promise = onAction();
        const isPromise = typeof promise !== "undefined";
        if (isPromise) {
          setInProgress(true);
          externalSetInProgress && setInProgress(true);
          if (isPromise) await promise;
          externalSetInProgress && setInProgress(false);
          setInProgress(false);
        }
      }}
      disabled={localInProgress}
    >
      {iconPosition === "right" && buttonText}
      {localInProgress ? (
        <LuiMiniSpinner
          size={16}
          divProps={{
            "data-testid": "loading-spinner",
            style: {
              margin: 0,
              paddingRight: 5,
              paddingLeft: 3,
              paddingBottom: 0,
              paddingTop: 0,
            },
            role: "status",
            "aria-label": "Loading",
          }}
        />
      ) : (
        <LuiIcon
          name={icon}
          alt={ariaLabel ?? name ?? ""}
          size={size}
          spanProps={{ style: iconPosition === "right" ? { transform: "scaleX(-1)" } : {} }}
        />
      )}
      {iconPosition === "left" && buttonText}
    </LuiButton>
  );
};
