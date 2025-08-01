import '@linzjs/lui/dist/scss/base.scss';
import '@linzjs/lui/dist/fonts';

import { Meta, StoryFn } from '@storybook/react-vite';
import { useCallback } from 'react';

import { ActionButton } from '../../lui/ActionButton';
import { wait } from '../../utils/util';

export default {
  title: 'Components / ActionButton',
  component: ActionButton,
  args: {},
} as Meta<typeof ActionButton>;

const ActionButtonTemplate: StoryFn<typeof ActionButton> = () => {
  const performAction = useCallback(async () => {
    await wait(1000);
  }, []);
  return (
    <>
      <ActionButton icon={'ic_add'} name={'Add new row'} inProgressName={'Adding...'} onClick={performAction} />
      <br />
      <ActionButton icon={'ic_add'} aria-label={'Add new row'} onClick={performAction} level={'primary'} />
      <br />
      <ActionButton
        icon={'ic_add'}
        aria-label={'Add new row'}
        onClick={performAction}
        level={'primary'}
        className={'ActionButton-tight'}
      />
      <br />
      <ActionButton
        icon={'ic_arrow_forward_right'}
        name={'Continue'}
        onClick={performAction}
        iconPosition={'right'}
        level={'secondary'}
        className={'ActionButton-fill'}
        style={{ maxWidth: 160 }}
      />
      <br />
      <ActionButton
        icon={'ic_arrow_forward_right'}
        name={'Disabled'}
        onClick={performAction}
        iconPosition={'right'}
        level={'secondary'}
        className={'ActionButton-fill'}
        style={{ maxWidth: 160 }}
        disabled={true}
      />
    </>
  );
};

export const ActionButtonSimple = ActionButtonTemplate.bind({});
