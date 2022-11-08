import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { ActionButton } from "../../lui/ActionButton";
import { useCallback, useState } from "react";
import { wait } from "../../utils/util";

export default {
  title: "Components / ActionButton",
  component: ActionButton,
  args: {},
} as ComponentMeta<typeof ActionButton>;

const ActionButtonTemplate: ComponentStory<typeof ActionButton> = () => {
  const [inProgress, setInProgress] = useState(false);
  const performAction = useCallback(async () => {
    setInProgress(true);
    await wait(1000);
    setInProgress(false);
  }, []);
  return (
    <ActionButton
      icon={"ic_add"}
      name={"Add new row"}
      inProgressName={"Adding..."}
      inProgress={inProgress}
      onClick={performAction}
    />
  );
};

export const ActionButtonSimple = ActionButtonTemplate.bind({});
