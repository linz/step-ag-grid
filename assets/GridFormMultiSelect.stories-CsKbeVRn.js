import{j as e}from"./jsx-runtime-QvZ8i92b.js";/* empty css              */import{a as l}from"./GridUpdatingContextProvider-B57ju6NF.js";import"./stateDeferredHook-3pr3Jmby.js";import{n as s,m as c}from"./GridWrapper-DJOqlb4b.js";import{r as d}from"./index-uubelm5h.js";import"./Grid-CzMsKtE0.js";import"./index-CMOtJUyO.js";import"./util-BMTC4KOK.js";import"./ActionButton-CKl6PlbN.js";const P={title:"GridForm / Static Tests",component:s,args:{}},p=a=>{const r=[["No options",{options:[]}],["Custom no options",{options:[],noOptionsMessage:"Custom no options"}],["With options",{options:[{label:"One",value:0,checked:!0},{label:"Two",value:1}]}],["With filter",{filtered:!0,options:[{label:"One",value:0},{label:"With warning",value:1,warning:"Test warning"},{label:"Three",value:2,checked:!0}]}]],i=r.map(()=>d.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(l,{children:r.map((n,t)=>e.jsxs("div",{children:[e.jsx("h6",{ref:i[t],children:n[0]}),e.jsx(c.Provider,{value:{anchorRef:i[t],data:{value:n[2]},value:n[2],field:"value"},children:e.jsx(s,{...a,...n[1]})})]},`${t}`))})})},o=p.bind({});o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`props => {
  const configs: [string, GridFormMultiSelectProps<GridBaseRow>, string?][] = [["No options", {
    options: []
  }], ["Custom no options", {
    options: [],
    noOptionsMessage: "Custom no options"
  }], ["With options", {
    options: [{
      label: "One",
      value: 0,
      checked: true
    }, {
      label: "Two",
      value: 1
    }]
  }], ["With filter", {
    filtered: true,
    options: [{
      label: "One",
      value: 0
    }, {
      label: "With warning",
      value: 1,
      warning: "Test warning"
    }, {
      label: "Three",
      value: 2,
      checked: true
    }]
  }]];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = configs.map(() => useRef<HTMLHeadingElement>(null));
  return <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        {configs.map((config, index) => <div key={\`\${index}\`}>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider value={(({
          anchorRef: anchorRefs[index],
          data: {
            value: config[2]
          },
          value: config[2],
          field: "value"
        } as any) as GridPopoverContextType<any>)}>
              <GridFormMultiSelect {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </div>)}
      </GridContextProvider>
    </div>;
}`,...o.parameters?.docs?.source}}};const R=["GridFormMultiSelect_"];export{o as GridFormMultiSelect_,R as __namedExportsOrder,P as default};
