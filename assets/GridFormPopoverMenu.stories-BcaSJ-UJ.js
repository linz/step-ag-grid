import{j as e}from"./util-DLs6oNd5.js";/* empty css              *//* empty css              */import"./stateDeferredHook-XdB2k1Hj.js";import{I as t,P as d,D as l}from"./GridWrapper-AYTIASZI.js";import{r as p}from"./iframe-BP35bxbM.js";import"./Grid-BkkVO4Ox.js";import{a as m}from"./GridUpdatingContextProvider-HjD1Gfdc.js";import"./ActionButton-DVSYuZ1g.js";import"./index-BoYIildN.js";import"./preload-helper-PPVm8Dsz.js";const M={title:"GridForm / Static Tests",component:t,args:{}},c=a=>{const r=[["No options",{options:()=>[]}],["Enabled/disabled/hidden and divider",{options:()=>[{label:"Enabled",value:1},d,{label:"Disabled",value:0,disabled:!0},{label:"ERROR! this should be hidden",value:3,hidden:!0}]}]],n=r.map(()=>p.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(m,{children:r.map((i,s)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[s],children:i[0]}),e.jsx(l.Provider,{value:{anchorRef:n[s]},children:e.jsx(t,{...a,...i[1]})})]}))})})},o=c.bind({});o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`props => {
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
}`,...o.parameters?.docs?.source}}};const j=["GridFormPopoverMenu_"];export{o as GridFormPopoverMenu_,j as __namedExportsOrder,M as default};
