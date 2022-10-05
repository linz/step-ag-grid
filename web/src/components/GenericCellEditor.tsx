import { Component, ReactElement } from "react";
import { ICellEditorParams } from "ag-grid-community";

export interface GenericCellEditorParams<T> extends ICellEditorParams {
  getDisplay: (row: T, selectedItems: T[], stopEditing: () => void) => ReactElement;
}

export class GenericCellEditor<T> extends Component<GenericCellEditorParams<T>> {
  constructor(props: GenericCellEditorParams<T>) {
    super(props);
    this.state = { value: props.value };
  }

  getValue(): any {
    // @ts-ignore
    return this.state.value;
  }

  render(): JSX.Element {
    // We use the grid's view of selectedItems, which is conveniently available and will be up-to-date. Note that we
    // are extracting the mark itself, but really only the ID is required. We could greatly simplify this by creating
    // a convention that the ag-grid row key must match the identifier used to track the selection state, although the
    // ag-grid key does need to be a string...
    const selectedRows = this.props.api.getSelectedRows();
    return this.props.getDisplay(this.props.data, selectedRows, this.props.stopEditing);
  }
}
