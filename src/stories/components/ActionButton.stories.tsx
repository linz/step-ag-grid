import "@linzjs/lui/dist/scss/base.scss";
import "@linzjs/lui/dist/fonts";

import { ComponentMeta, ComponentStory } from "@storybook/react/dist/ts3.9/client/preview/types-6-3";
import { ActionButton } from "../../lui/ActionButton";
import { useCallback } from "react";
import { wait } from "../../utils/util";

export default {
  title: "Components / ActionButton",
  component: ActionButton,
  args: {},
} as ComponentMeta<typeof ActionButton>;

const ActionButtonTemplate: ComponentStory<typeof ActionButton> = () => {
  const performAction = useCallback(async () => {
    await wait(1000);
  }, []);
  return (
    <>
      <ActionButton icon={"ic_add"} name={"Add new row"} inProgressName={"Adding..."} onClick={performAction} />
      <br />
      <ActionButton icon={"ic_add"} aria-label={"Add new row"} onClick={performAction} level={"primary"} />
      <br />
      <ActionButton
        icon={"ic_arrow_back"}
        name={"Continue"}
        onClick={performAction}
        iconPosition={"right"}
        level={"secondary"}
        className={"ActionButton-fill"}
        style={{ maxWidth: 160 }}
      />
    </>
  );
};

export const ActionButtonSimple = ActionButtonTemplate.bind({});
