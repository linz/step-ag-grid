import{j as e}from"./util-Bw02gGHb.js";/* empty css              */import{a as d}from"./GridUpdatingContextProvider-Duqjn_xW.js";import"./stateDeferredHook-DLHxM2Up.js";import{D as t,P as l,B as p}from"./GridWrapper-CbDPn0wg.js";import{r as c}from"./iframe-h4MqiH0z.js";import"./Grid-P3HtWBHg.js";import"./ActionButton-QdnM2Y72.js";import"./index-Dn-ukQb7.js";import"./preload-helper-Ct5FWWRu.js";const E={title:"GridForm / Static Tests",component:t,args:{}},m=a=>{const n=[["No options",{options:()=>[]}],["Enabled/disabled/hidden and divider",{options:()=>[{label:"Enabled",value:1},l,{label:"Disabled",value:0,disabled:!0},{label:"ERROR! this should be hidden",value:3,hidden:!0}]}]],r=n.map(()=>c.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(d,{children:n.map((i,s)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:r[s],children:i[0]}),e.jsx(p.Provider,{value:{anchorRef:r[s]},children:e.jsx(t,{...a,...i[1]})})]}))})})},o=m.bind({});o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`props => {
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
