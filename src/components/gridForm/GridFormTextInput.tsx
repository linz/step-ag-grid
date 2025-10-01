import { useCallback, useMemo, useState } from 'react';

import { useGridPopoverContext } from '../../contexts/GridPopoverContext';
import { TextInputFormatted } from '../../lui/TextInputFormatted';
import { TextInputValidator, TextInputValidatorProps } from '../../utils/textValidator';
import { GridBaseRow } from '../Grid';
import { CellEditorCommon } from '../GridCell';
import { useGridPopoverHook } from '../GridPopoverHook';

export interface GridFormTextInputProps<TData extends GridBaseRow>
  extends TextInputValidatorProps<TData>,
    CellEditorCommon {
  placeholder?: string;
  units?: string;
  width?: string | number;
  onSave?: (props: { selectedRows: TData[]; value: string }) => Promise<boolean>;
  helpText?: string;
}

export const GridFormTextInput = <TData extends GridBaseRow>(props: GridFormTextInputProps<TData>) => {
  const { field, value: initialVale, data } = useGridPopoverContext<TData>();

  const helpText = props.helpText ?? 'Press enter or tab to save';

  const initValue = useMemo(() => (initialVale == null ? '' : `${initialVale}`), [initialVale]);
  const [value, setValue] = useState(initValue);

  const invalid = useCallback(() => TextInputValidator<TData>(props, value, data, {}), [data, props, value]);

  const save = useCallback(
    async (selectedRows: TData[]): Promise<boolean> => {
      if (invalid()) {
        return false;
      }

      const trimmedValue = value.trim();
      // No change, so don't save
      if (initValue === trimmedValue) {
        return true;
      }

      if (props.onSave) {
        return await props.onSave({ selectedRows, value: trimmedValue });
      }

      selectedRows.forEach((row) => (row[field] = trimmedValue as any));
      return true;
    },
    [invalid, value, initValue, props, field],
  );
  const { popoverWrapper } = useGridPopoverHook({
    className: props.className,
    invalid,
    save,
  });

  return popoverWrapper(
    <div style={{ display: 'flex', flexDirection: 'row' }} className={'FormTest subComponent'}>
      <TextInputFormatted
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={invalid()}
        formatted={props.units}
        style={{ width: props.width ?? 240 }}
        placeholder={props.placeholder ?? 'Type here'}
        helpText={helpText}
      />
    </div>,
  );
};
