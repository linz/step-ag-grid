import { IconName } from '@linzjs/lui/dist/components/LuiIcon/LuiIcon';
import { useCallback, useState } from 'react';

export const gridCopyOptions: Record<string, { text: string; icon: IconName; developer?: boolean }> = {
  plain_text: { text: 'Text', icon: 'ic_text_match' },
  csv: { text: 'CSV', icon: 'ic_csv_file' },
  markdown: { text: 'Markdown', icon: 'ic_view_week' },
  json: { text: 'Json', icon: 'ic_file_attached_outline', developer: true },
};
export type CopyOptionsKey = keyof typeof gridCopyOptions;

const CopyOptionsStorageKey = 'stepAgGrid_defaultCopy';

export const useGridCopySettings = () => {
  const [copyType, _setCopyType] = useState<CopyOptionsKey>(() => {
    const defaultCopy = window.localStorage.getItem(CopyOptionsStorageKey) ?? '';
    return Object.keys(gridCopyOptions).includes(defaultCopy) ? defaultCopy : 'plain_text';
  });

  const setCopyType = useCallback((key: CopyOptionsKey) => {
    window.localStorage.setItem(CopyOptionsStorageKey, key);
    _setCopyType(key);
  }, []);

  return {
    copyType,
    setCopyType,
  };
};
