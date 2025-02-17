import { createContext } from 'react';

export interface GridSubComponentContextType {
  value: any;
  data: any;
  setValue: (value: string) => void;
  setValid: (valid: boolean) => void;
  triggerSave: () => Promise<void>;
  context: any;
}

export const GridSubComponentContext = createContext<GridSubComponentContextType>({
  value: 'GridSubComponentContext value no context',
  data: {},
  setValue: () => {
    console.error('GridSubComponentContext setValue no context');
  },
  setValid: () => {
    console.error('GridSubComponentContext setValid no context');
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  triggerSave: async () => {
    console.error('GridSubComponentContext triggerSave no context');
  },
  context: null,
});
