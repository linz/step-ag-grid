import { TestComponent } from "../components/testComponent";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import React from "react";

export default {
    title: "Components/TestComponentStory",
    component: TestComponent,
} as ComponentMeta<typeof TestComponent>;

const TestComponentStory: ComponentStory<typeof TestComponent> = () => (
    <TestComponent height={100} width={100} text={"hello world"} textColor={"red"} backgroundColor={"black"}/>
);

export const ThreeNodes = TestComponentStory.bind({});
