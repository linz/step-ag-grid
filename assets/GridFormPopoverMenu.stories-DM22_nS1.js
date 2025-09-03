import{j as e}from"./util-eZhZbfsr.js";/* empty css              */import{D as t,P as d,B as l}from"./GridWrapper-BQp-g5Ca.js";import"./stateDeferredHook-DITQGBk8.js";import{r as p}from"./iframe-DPaswKtK.js";import"./Grid-rACfpCEn.js";import{a as c}from"./GridUpdatingContextProvider-QXyZC2KO.js";import"./ActionButton-DvHFrPXG.js";import"./index-DlFCgIiE.js";import"./preload-helper-Ct5FWWRu.js";const E={title:"GridForm / Static Tests",component:t,args:{}},m=a=>{const n=[["No options",{options:()=>[]}],["Enabled/disabled/hidden and divider",{options:()=>[{label:"Enabled",value:1},d,{label:"Disabled",value:0,disabled:!0},{label:"ERROR! this should be hidden",value:3,hidden:!0}]}]],r=n.map(()=>p.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(c,{children:n.map((i,s)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:r[s],children:i[0]}),e.jsx(l.Provider,{value:{anchorRef:r[s]},children:e.jsx(t,{...a,...i[1]})})]}))})})},o=m.bind({});o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`props => {
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
}`,...o.parameters?.docs?.source}}};const M=["GridFormPopoverMenu_"];export{o as GridFormPopoverMenu_,M as __namedExportsOrder,E as default};
