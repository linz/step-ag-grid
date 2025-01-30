import { createContext } from 'react';

import { EventHandler, RadioChangeEvent } from '../types';

export const RadioGroupContext = createContext<{
  value?: any;
  name?: string;
  onRadioChange?: EventHandler<RadioChangeEvent>;
}>({});
