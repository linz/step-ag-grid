import { LuiMiniSpinner } from "@linzjs/lui";

export const GridLoadableCell = (props: {
  isLoading: boolean;
  dataTestId?: string;
  children: JSX.Element | string;
}): JSX.Element => {
  // console.log(`Rendering LoadableCell - loading: ${props.isLoading}`);
  if (props.isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <LuiMiniSpinner size={22} divProps={{ role: "status", "aria-label": "Loading", style: { marginBottom: 4 } }} />
      </div>
    );
  }
  // only add test id into ONE of the columns in a grid. this way each row will have one unique id :)
  return (
    <div data-testid={props.dataTestId} style={{ display: "flex", alignItems: "center" }}>
      {props.children}
    </div>
  );
};
