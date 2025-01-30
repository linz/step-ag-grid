import '../../../react-menu3/styles/index.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react';
import { GridPopoverContext, GridPopoverContextType } from 'contexts/GridPopoverContext';
import { useRef } from 'react';

import { GridBaseRow, GridContextProvider, GridFormDropDown, GridFormDropDownProps, MenuHeaderItem } from '../../..';

export default {
  title: 'GridForm / Static Tests',
  component: GridFormDropDown,
  args: {},
} as Meta<typeof GridFormDropDown>;

const Template: StoryFn<typeof GridFormDropDown> = (props: GridFormDropDownProps<any>) => {
  const configs: [string, GridFormDropDownProps<GridBaseRow>, string?][] = [
    ['No options', { options: [] }],
    ['Custom no options', { options: [], noOptionsMessage: 'Custom no options' }],
    [
      'Enabled and disabled',
      {
        options: [
          { label: 'Enabled', value: 1 },
          { label: 'Disabled', value: 0, disabled: true },
        ],
      },
    ],
    [
      'Headers',
      {
        options: [
          MenuHeaderItem('Header 1'),
          { label: 'Option 1', value: 1 },
          MenuHeaderItem('Header 2'),
          { label: 'Option 2', value: 2 },
        ],
      },
    ],
    [
      'Filter',
      {
        filtered: 'local',
        options: [
          MenuHeaderItem('Header 1'),
          { label: 'Option 1', value: 1 },
          MenuHeaderItem('Header 2'),
          { label: 'Option 2', value: 2 },
        ],
      },
    ],
    [
      'Filter custom placeholder',
      {
        filtered: 'local',
        filterPlaceholder: 'Custom placeholder',
        filterHelpText: 'Filter help text',
        options: [MenuHeaderItem('Header 1'), { label: 'Option 1', value: 1 }],
      },
    ],
    [
      'Filter help text and default filter text',
      {
        filtered: 'local',
        filterHelpText: 'Filter help text',
        filterDefaultValue: 'filter',
        options: [
          MenuHeaderItem('Header 1'),
          { label: 'Filter match', value: 1 },
          MenuHeaderItem('ERROR! this header should not be visible'),
          { label: 'ERROR! this option should not be visible', value: 2 },
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
          <div key={`${index}`}>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider
              value={
                {
                  anchorRef: anchorRefs[index],
                  data: { value: config[2] },
                  value: config[2],
                  field: 'value',
                } as any as GridPopoverContextType<any>
              }
            >
              <GridFormDropDown {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </div>
        ))}
      </GridContextProvider>
    </div>
  );
};

export const GridFormDropDown_ = Template.bind({});
