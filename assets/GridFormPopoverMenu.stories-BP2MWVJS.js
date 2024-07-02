import{j as e}from"./jsx-runtime-QvZ8i92b.js";/* empty css              */import{a as d}from"./GridUpdatingContextProvider-B57ju6NF.js";import"./stateDeferredHook-3pr3Jmby.js";import{m as l}from"./GridWrapper-DJOqlb4b.js";import{r as p}from"./index-uubelm5h.js";import"./Grid-CzMsKtE0.js";import"./index-CMOtJUyO.js";import"./util-BMTC4KOK.js";import{G as a,P as c}from"./GridFormPopoverMenu-ZxOdRx-U.js";import"./ActionButton-CKl6PlbN.js";const M={title:"GridForm / Static Tests",component:a,args:{}},m=t=>{const n=[["No options",{options:async()=>[]}],["Enabled/disabled/hidden and divider",{options:async()=>[{label:"Enabled",value:1},c,{label:"Disabled",value:0,disabled:!0},{label:"ERROR! this should be hidden",value:3,hidden:!0}]}]],r=n.map(()=>p.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(d,{children:n.map((i,s)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:r[s],children:i[0]}),e.jsx(l.Provider,{value:{anchorRef:r[s]},children:e.jsx(a,{...t,...i[1]})})]}))})})},o=m.bind({});o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`props => {
  const configs: [string, GridFormPopoverMenuProps<GridBaseRow>][] = [["No options", {
    options: async () => []
  }], ["Enabled/disabled/hidden and divider", {
    options: async () => [{
      label: "Enabled",
      value: 1
    }, PopoutMenuSeparator, {
      label: "Disabled",
      value: 0,
      disabled: true
    }, {
      label: "ERROR! this should be hidden",
      value: 3,
      hidden: true
    }]
  }]];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = configs.map(() => useRef<HTMLHeadingElement>(null));
  return <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        {configs.map((config, index) => <>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider value={(({
          anchorRef: anchorRefs[index]
        } as any) as GridPopoverContextType<any>)}>
              <GridFormPopoverMenu {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>)}
      </GridContextProvider>
    </div>;
}`,...o.parameters?.docs?.source}}};const j=["GridFormPopoverMenu_"];export{o as GridFormPopoverMenu_,j as __namedExportsOrder,M as default};
