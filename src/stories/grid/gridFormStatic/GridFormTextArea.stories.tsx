import '../../../react-menu3/styles/index.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react';
import { GridPopoverContext, GridPopoverContextType } from 'contexts/GridPopoverContext';
import { useRef } from 'react';

import { GridBaseRow, GridContextProvider, GridFormTextArea, GridFormTextAreaProps } from '../../..';

export default {
  title: 'GridForm / Static Tests',
  component: GridFormTextArea,
  args: {},
} as Meta<typeof GridFormTextArea>;

const Template: StoryFn<typeof GridFormTextArea> = (props: GridFormTextAreaProps<any>) => {
  const configs: [string, GridFormTextAreaProps<GridBaseRow>, string?][] = [
    ['Text area', {}],
    ['Text area with text', {}, 'Some text'],
    ['Text area with error & placeholder', { required: true, placeholder: 'Custom placeholder' }],
  ];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = configs.map(() => useRef<HTMLHeadingElement>(null));

  return (
    <div className={'react-menu-inline-test'}>
      <GridContextProvider>
        {configs.map((config, index) => (
          <>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider
              value={{ anchorRef: anchorRefs[index], value: config[2] } as any as GridPopoverContextType<any>}
            >
              <GridFormTextArea {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>
        ))}
      </GridContextProvider>
    </div>
  );
};

export const GridFormTextArea_ = Template.bind({});
