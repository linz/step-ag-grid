import { TestComponent } from "../../components/TestComponent";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import React from "react";

export default {
    title: "Components/TestComponentStories",
    component: TestComponent,
} as ComponentMeta<typeof TestComponent>;

const TestComponentStories: ComponentStory<typeof TestComponent> = () => (
    <TestComponent height={100} width={100} text={"hello world"} textColor={"red"} backgroundColor={"black"}/>
);

export const TestComponentStory = TestComponentStories.bind({});
