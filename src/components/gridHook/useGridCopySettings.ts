import { useCallback, useState } from 'react';

export const gridCopyOptions = {
  plain_text: ['Plain text', 'ic_text_match'],
  csv: ['CSV', 'ic_csv_file'],
  markdown: ['Markdown', 'ic_view_week'],
};
export type CopyOptionsKey = keyof typeof gridCopyOptions;

const CopyOptionsStorageKey = 'stepAgGrid_defaultCopy';

export const useGridCopySettings = () => {
  const [copyType, _setCopyType] = useState<CopyOptionsKey>(() => {
    const defaultCopy = window.localStorage.getItem(CopyOptionsStorageKey) ?? '';
    return (Object.keys(gridCopyOptions).includes(defaultCopy) ? defaultCopy : 'plain_text') as CopyOptionsKey;
  });

  const setCopyType = useCallback((key: CopyOptionsKey) => {
    window.localStorage.setItem(CopyOptionsStorageKey, key);
    console.log('set copy type', key);
    _setCopyType(key);
  }, []);

  return {
    copyType,
    setCopyType,
  };
};
