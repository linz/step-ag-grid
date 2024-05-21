import { IHeaderParams } from "ag-grid-community";
import clsx from "clsx";
import { useEffect, useState } from "react";

/**
 * AgGrid's existing select header doesn't work the way we want.
 * If you have partial select then clicking the header checkbox will select all,
 * but we want to deselect all on partial select.
 */
export const GridHeaderSelect = ({ api }: IHeaderParams) => {
  // This is used to force an update on selection change
  const [updateCounter, setUpdateCounter] = useState(0);
  const selectedNodeCount = api.getSelectedRows().length;

  useEffect(() => {
    const clickHandler = () => {
      setUpdateCounter(updateCounter + 1);
    };

    api.addEventListener("selectionChanged", clickHandler);
    return () => {
      !api.isDestroyed() && api.removeEventListener("selectionChanged", clickHandler);
    };
  }, [api, updateCounter]);

  const handleMultiSelect = () => {
    if (selectedNodeCount == 0) {
      api.selectAllFiltered();
    } else {
      api.deselectAll();
    }
  };

  const totalNodeCount = api.getDisplayedRowCount();
  const partialSelect = selectedNodeCount != 0 && selectedNodeCount != totalNodeCount;
  const allSelected = selectedNodeCount != 0 && selectedNodeCount == totalNodeCount;

  return (
    <div
      className={clsx(
        "ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper",
        partialSelect && "ag-indeterminate",
        allSelected && "ag-checked",
      )}
      onClick={handleMultiSelect}
    >
      <input
        type="checkbox"
        className={"ag-checkbox-input-wrapper"}
        onChange={() => {
          /* do nothing */
        }}
      />
    </div>
  );
};
