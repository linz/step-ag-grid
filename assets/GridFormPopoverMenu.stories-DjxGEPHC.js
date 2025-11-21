import{j as e}from"./util-B1lB3GhT.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Cj269tWz.js";import{K as t,P as d,I as l}from"./GridWrapper-DtoEoUNi.js";import{r as p}from"./iframe-smKoh4tb.js";import"./Grid-Q3rFMtHJ.js";import"./client-Kh56r61r.js";import{a as m}from"./GridUpdatingContextProvider-qT4OMujP.js";import"./ActionButton-Bm-II8tU.js";import"./index-WFabMzKZ.js";import"./preload-helper-PPVm8Dsz.js";const j={title:"GridForm / Static Tests",component:t,args:{}},c=a=>{const r=[["No options",{options:()=>[]}],["Enabled/disabled/hidden and divider",{options:()=>[{label:"Enabled",value:1},d,{label:"Disabled",value:0,disabled:!0},{label:"ERROR! this should be hidden",value:3,hidden:!0}]}]],n=r.map(()=>p.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(m,{children:r.map((i,s)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[s],children:i[0]}),e.jsx(l.Provider,{value:{anchorRef:n[s]},children:e.jsx(t,{...a,...i[1]})})]}))})})},o=c.bind({});o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`props => {
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
