import clsx from "clsx";
import { GridBaseRow } from "../Grid";
import { ColDefT, GenericCellEditorProps, GridCell } from "../GridCell";
import { GridFormDropDown, GridFormDropDownProps } from "../gridForm/GridFormDropDown";
import { GenericCellColDef } from "../gridRender/GridRenderGenericCell";

export const GridPopoverEditDropDown = <TData extends GridBaseRow, TValue = any>(
  colDef: GenericCellColDef<TData, TValue>,
  props: GenericCellEditorProps<GridFormDropDownProps<TData>>,
): ColDefT<TData, TValue> =>
  GridCell<TData, TValue, GridFormDropDownProps<TData>>(colDef, {
    editor: GridFormDropDown,
    ...props,
    editorParams: {
      ...(props.editorParams as GridFormDropDownProps<TData>),
      className: clsx(
        {
          "GridPopoverEditDropDown-containerLarge": !props.editorParams?.className?.includes(
            "GridPopoverEditDropDown-container",
          ),
        },
        props.editorParams?.className,
      ),
    },
  });
