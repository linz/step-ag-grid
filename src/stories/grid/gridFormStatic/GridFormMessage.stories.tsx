import '../../../react-menu3/styles/index.scss';
import '../../../styles/index.scss';
import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { GridPopoverContext, GridPopoverContextType } from 'contexts/GridPopoverContext';
import { useRef } from 'react';

import { GridContextProvider, GridFormMessage, GridFormMessageProps } from '../../..';

export default {
  title: 'GridForm / Static Tests',
  component: GridFormMessage,
  args: {},
} as Meta<typeof GridFormMessage>;

const Template: StoryFn<typeof GridFormMessage> = (props: GridFormMessageProps<any>) => {
  const anchorRef1 = useRef<HTMLHeadingElement>(null);

  return (
    <div className={'react-menu-inline-test'}>
      <GridContextProvider>
        <h6 ref={anchorRef1}>Standard Message</h6>
        <GridPopoverContext.Provider value={{ anchorRef: anchorRef1 } as any as GridPopoverContextType<any>}>
          <GridFormMessage {...props} message={() => <span>This is a message</span>} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>
  );
};

export const GridFormMessage_ = Template.bind({});
