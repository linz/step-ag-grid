import { LuiIcon } from '@linzjs/lui';
import { useContext, useEffect, useState } from 'react';

import { GridContext } from '../../contexts/GridContext';

export interface GridFilterQuickProps {
  quickFilterPlaceholder?: string;
  defaultValue?: string;
}

export const GridFilterQuick = ({ quickFilterPlaceholder, defaultValue }: GridFilterQuickProps) => {
  const { setQuickFilter } = useContext(GridContext);
  const [quickFilterValue, setQuickFilterValue] = useState(defaultValue ?? '');

  useEffect(() => {
    setQuickFilter(quickFilterValue);
  }, [quickFilterValue, setQuickFilter]);

  return (
    <div className="GridFilterQuick-container">
      <div className="GridFilterQuick-icon">
        <LuiIcon name={'ic_search'} alt={'Search'} size={'md'} />
      </div>
      <input
        aria-label="Search"
        className="GridFilterQuick-input"
        type="text"
        placeholder={quickFilterPlaceholder ?? 'Search'}
        value={quickFilterValue}
        onChange={(event) => {
          setQuickFilterValue(event.target.value);
        }}
      />
    </div>
  );
};
