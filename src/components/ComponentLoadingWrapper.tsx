import { LuiMiniSpinner } from "@linzjs/lui";

/**
 * If loading is true this returns a loading spinner, otherwise it returns its children.
 */
export const ComponentLoadingWrapper = (props: {
  loading?: boolean;
  saving?: boolean;
  children: JSX.Element | undefined;
  className: string | undefined;
}): JSX.Element => {
  return props.loading ? (
    <LuiMiniSpinner size={22} divProps={{ role: "status", ["aria-label"]: "Loading", style: { padding: 16 } }} />
  ) : (
    <div style={{ pointerEvents: props.saving ? "none" : "inherit" }} className={props.className}>
      {props.saving && <div className={"ComponentLoadingWrapper-saveOverlay"} />}
      {props.children}
    </div>
  );
};
