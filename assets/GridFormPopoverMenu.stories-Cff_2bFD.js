import{j as e}from"./util-CgugAU5W.js";/* empty css              *//* empty css              */import"./stateDeferredHook-DLMcti5_.js";import{K as t,P as d,I as l}from"./GridWrapper-ByjUL_3E.js";import{r as p}from"./iframe-qoNDcQrb.js";import"./Grid-vjV2ljNn.js";import"./client-DIuOxkbO.js";import{a as m}from"./GridUpdatingContextProvider-CR4twmSI.js";import"./ActionButton-CzX0v5O0.js";import"./index-2kSpQblA.js";import"./preload-helper-PPVm8Dsz.js";const j={title:"GridForm / Static Tests",component:t,args:{}},c=a=>{const r=[["No options",{options:()=>[]}],["Enabled/disabled/hidden and divider",{options:()=>[{label:"Enabled",value:1},d,{label:"Disabled",value:0,disabled:!0},{label:"ERROR! this should be hidden",value:3,hidden:!0}]}]],n=r.map(()=>p.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(m,{children:r.map((i,s)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[s],children:i[0]}),e.jsx(l.Provider,{value:{anchorRef:n[s]},children:e.jsx(t,{...a,...i[1]})})]}))})})},o=c.bind({});o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`props => {
  const configs: [string, GridFormPopoverMenuProps<GridBaseRow>][] = [['No options', {
    options: () => []
  }], ['Enabled/disabled/hidden and divider', {
    options: () => [{
      label: 'Enabled',
      value: 1
    }, PopoutMenuSeparator, {
      label: 'Disabled',
      value: 0,
      disabled: true
    }, {
      label: 'ERROR! this should be hidden',
      value: 3,
      hidden: true
    }]
  }]];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = configs.map(() => useRef<HTMLHeadingElement>(null));
  return <div className={'react-menu-inline-test'}>
      <GridContextProvider>
        {configs.map((config, index) => <>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider value={{
          anchorRef: anchorRefs[index]
        } as any as GridPopoverContextType<any>}>
              <GridFormPopoverMenu {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>)}
      </GridContextProvider>
    </div>;
}`,...o.parameters?.docs?.source}}};const F=["GridFormPopoverMenu_"];export{o as GridFormPopoverMenu_,F as __namedExportsOrder,j as default};
