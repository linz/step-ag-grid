import { bool, exact, func, number, object, oneOf, oneOfType, string } from 'prop-types';

export const stylePropTypes = (name?: string) => ({
  [name ? `${name}ClassName` : 'className']: oneOfType([string, func]),
});

export const Direction = oneOf(['left', 'right', 'top', 'bottom']);

// Menu, SubMenu and ControlledMenu
export const menuPropTypes = {
  className: string,
  ...stylePropTypes('menu'),
  ...stylePropTypes('arrow'),
  menuStyle: object,
  arrowStyle: object,
  arrow: bool,
  setDownOverflow: bool,
  offsetX: number,
  offsetY: number,
  align: oneOf(['start', 'center', 'end']),
  direction: Direction,
  position: oneOf(['auto', 'anchor', 'initial']),
  overflow: oneOf(['auto', 'visible', 'hidden']),
};

// Menu and ControlledMenu
export const rootMenuPropTypes = {
  ...menuPropTypes,
  containerProps: object,
  initialMounted: bool,
  unmountOnClose: bool,
  transition: oneOfType([
    bool,
    exact({
      open: bool,
      close: bool,
      item: bool,
    }),
  ]),
  transitionTimeout: number,
  boundingBoxRef: object,
  boundingBoxPadding: string,
  reposition: oneOf(['auto', 'initial']),
  repositionFlag: oneOfType([string, number]),
  viewScroll: oneOf(['auto', 'close', 'initial']),
  submenuOpenDelay: number,
  submenuCloseDelay: number,
  portal: oneOfType([
    bool,
    exact({
      target: object,
      stablePosition: bool,
    }),
  ]),
  theming: string,
  onItemClick: func,
};

// Menu and SubMenu
export const uncontrolledMenuPropTypes = {
  instanceRef: oneOfType([object, func]),
  onMenuChange: func,
};
