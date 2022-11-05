import { createContext } from "react";
import { EventHandler } from "../types";
import { RadioChangeEvent } from "../components/MenuRadioGroup";

export const RadioGroupContext = createContext<{
  value?: any;
  name?: string;
  onRadioChange?: EventHandler<RadioChangeEvent>;
}>({});
