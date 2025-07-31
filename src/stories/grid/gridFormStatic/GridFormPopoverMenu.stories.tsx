import '../../../react-menu3/styles/index.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { GridPopoverContext, GridPopoverContextType } from 'contexts/GridPopoverContext';
import { useRef } from 'react';

import {
  GridBaseRow,
  GridContextProvider,
  GridFormPopoverMenu,
  GridFormPopoverMenuProps,
  PopoutMenuSeparator,
} from '../../..';

export default {
  title: 'GridForm / Static Tests',
  component: GridFormPopoverMenu,
  args: {},
} as Meta<typeof GridFormPopoverMenu>;

const Template: StoryFn<typeof GridFormPopoverMenu> = (props) => {
  const configs: [string, GridFormPopoverMenuProps<GridBaseRow>][] = [
    ['No options', { options: () => [] }],
    [
      'Enabled/disabled/hidden and divider',
      {
        options: () => [
          { label: 'Enabled', value: 1 },
          PopoutMenuSeparator,
          { label: 'Disabled', value: 0, disabled: true },
          { label: 'ERROR! this should be hidden', value: 3, hidden: true },
        ],
      },
    ],
  ];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = configs.map(() => useRef<HTMLHeadingElement>(null));

  return (
    <div className={'react-menu-inline-test'}>
      <GridContextProvider>
        {configs.map((config, index) => (
          <>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider value={{ anchorRef: anchorRefs[index] } as any as GridPopoverContextType<any>}>
              <GridFormPopoverMenu {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>
        ))}
      </GridContextProvider>
    </div>
  );
};

export const GridFormPopoverMenu_ = Template.bind({});
