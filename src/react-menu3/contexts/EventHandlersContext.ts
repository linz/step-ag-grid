import { createContext } from 'react';

import { RMEvent } from '../utils';

export interface EventHandlersContextType {
  handleClose?: () => void;
  handleClick: (event: RMEvent, checked: boolean) => void;
}

export const EventHandlersContext = createContext<EventHandlersContextType>({
  handleClick: () => {},
});
