import { LuiMiniSpinner } from "@linzjs/lui";

/**
 * If loading is true this returns a loading spinner, otherwise it returns its children.
 */
export const ComponentLoadingWrapper = (props: {
  loading?: boolean;
  saving?: boolean;
  children: JSX.Element | undefined;
}): JSX.Element => {
  return props.loading ? (
    <LuiMiniSpinner size={22} divProps={{ role: "status", ["aria-label"]: "Loading", style: { padding: 16 } }} />
  ) : (
    <div style={{ maxHeight: 400, overflowY: "scroll", pointerEvents: props.saving ? "none" : "inherit" }}>
      {props.saving && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "rgba(64,64,64,0.1)",
            zIndex: 1000,
          }}
        />
      )}
      {props.children}
    </div>
  );
};
