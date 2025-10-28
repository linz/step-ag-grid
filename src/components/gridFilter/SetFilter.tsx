import './SetFilter.scss';

import { CheckboxItemRenderer, ILuiListBoxItem, LuiCheckboxInput, LuiListBox } from '@linzjs/lui';
import { IDoesFilterPassParams, IFilterParams, IRowNode } from 'ag-grid-community';
import { forwardRef, Key, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';

interface ISetFilterParams extends IFilterParams {
  labels?: Record<RecordKey, string>;
}

interface ISetFilterState {
  selectedKeys?: RecordKey[];
}

export type RecordKey = string | number;

export const BLANK_KEY = '__BLANK_KEY__';
const substituteBlanks = (key: RecordKey): RecordKey => key || BLANK_KEY;

/**
 * Comparator function used to sort the list of options alphabetically,
 * except BLANK_KEY should always be first.
 */
const blanksFirstSorter = (a: RecordKey, b: RecordKey): number => {
  if (a === BLANK_KEY) return -1;
  if (b === BLANK_KEY) return 1;
  return a.toString().localeCompare(b.toString());
};

const SetFilter = forwardRef((props: ISetFilterParams, ref) => {
  const [selected, setSelected] = useState<RecordKey[] | undefined>(undefined);
  const [field] = useState<string>(props.colDef.field!);
  const [keys, setKeys] = useState<RecordKey[]>([]);
  const allSelected = selected === undefined || selected.length === keys.length;

  const setKeysAsRecordKeys = (input: Key[]) => {
    setSelected(input as RecordKey[]);
  };

  useImperativeHandle(ref, () => {
    return {
      isFilterActive(): boolean {
        return selected !== undefined;
      },
      doesFilterPass(params: IDoesFilterPassParams): boolean {
        return Boolean(selected?.includes(substituteBlanks(params.data[field])));
      },
      getModel(): ISetFilterState {
        return { selectedKeys: selected };
      },
      setModel(model?: ISetFilterState) {
        setSelected(model?.selectedKeys || undefined);
      },
    };
  }, [selected, field]);

  /**
   * Returns a human-readable label for each key, custom labels can be provided via `filterParams` in the column definition
   */
  const getLabelForKey = useCallback(
    (key: RecordKey) => {
      const labels: Record<RecordKey, string> = {
        [BLANK_KEY]: 'blanks',
        ...props.labels,
      };
      return (key in labels ? labels[key] : key).toString();
    },
    [props.labels],
  );

  /**
   * Iterate over each row in the grid and generate a unique list of possible values.
   * Values that are falsy will be substituted with `__BLANK_KEY__` in order to normalize the handling of empty cells
   */
  const getUniqueKeys = useCallback(() => {
    const values = new Set<RecordKey>();
    props.api.forEachLeafNode((rowNode: IRowNode<unknown>) => {
      const data = rowNode.data as Record<string, RecordKey>;
      values.add(substituteBlanks(data[field]));
    });
    setKeys(Array.from(values).sort(blanksFirstSorter));
  }, [field, props.api]);

  /**
   * Generate a list of `ILuiListBoxItem` objects to render in the checkbox list
   */
  const listItems: ILuiListBoxItem[] = useMemo(
    () =>
      keys.map((key) => ({
        key: key as Key,
        label: getLabelForKey(key),
      })),
    [keys, getLabelForKey],
  );

  /**
   * When the component is first mounted, attempted to fetch a list of unique keys, however row data may not be present yet,
   * so an event listener must be attached to listen for when data is added later.
   */
  useEffect(() => {
    getUniqueKeys();
    props.api.addEventListener('rowDataUpdated', getUniqueKeys);
    return () => {
      props.api.removeEventListener('rowDataUpdated', getUniqueKeys);
    };
  }, [getUniqueKeys, props.api]);

  /**
   * Every time selection changes, tell the grid to filter the data.
   */
  useEffect(() => {
    props.filterChangedCallback();
  }, [props, selected]);

  const handleSelectAll = useCallback(() => {
    setSelected(allSelected ? [] : undefined);
  }, [allSelected]);

  return (
    <div className="SetFilter">
      <LuiCheckboxInput
        className="SetFilter-selectAll"
        label="Select All"
        value="true"
        isChecked={allSelected}
        onChange={handleSelectAll}
      />
      <LuiListBox
        className="SetFilter-listBox"
        selectionMode="multiple"
        ariaLabel="Toggle column visibility"
        value={(selected || keys) as Key[]}
        items={listItems}
        onChange={setKeysAsRecordKeys}
        itemRenderer={CheckboxItemRenderer}
      />
    </div>
  );
});
SetFilter.displayName = 'SetFilter';
export default SetFilter;
