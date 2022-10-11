import { LuiMiniSpinner } from "@linzjs/lui";

/**
 * If loading is true this returns a loading spinner, otherwise it returns its children.
 */
export const ComponentLoadingWrapper = (props: {
  loading: boolean;
  children: JSX.Element | undefined;
}): JSX.Element => {
  return props.loading ? (
    <LuiMiniSpinner size={22} divProps={{ role: "status", ["aria-label"]: "Loading", style: { padding: 16 } }} />
  ) : (
    props.children ?? <></>
  );
};
