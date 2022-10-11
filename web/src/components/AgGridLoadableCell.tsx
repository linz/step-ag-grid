import { LuiMiniSpinner } from "@linzjs/lui";

export const AgGridLoadableCell = (props: {
  isLoading: boolean;
  dataTestId?: string;
  children: JSX.Element;
}): JSX.Element => {
  // console.log(`Rendering LoadableCell - loading: ${isLoading}`);
  if (props.isLoading) {
    return <LuiMiniSpinner size={22} divProps={{ role: "status", ["aria-label"]: "Loading" }} />;
  }
  // only add test id into ONE of the columns in a grid. this way each row will have one unique id :)
  return (
    <div data-testid={props.dataTestId} style={{ display: "flex", alignItems: "center" }}>
      {props.children}
    </div>
  );
};
