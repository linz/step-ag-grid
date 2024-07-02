import{j as n}from"./jsx-runtime-QvZ8i92b.js";/* empty css              */import{a as d}from"./GridUpdatingContextProvider-B57ju6NF.js";import"./stateDeferredHook-3pr3Jmby.js";import{k as i,m as p,i as e}from"./GridWrapper-DJOqlb4b.js";import{r as u}from"./index-uubelm5h.js";import"./Grid-CzMsKtE0.js";import"./index-CMOtJUyO.js";import"./util-BMTC4KOK.js";import"./ActionButton-CKl6PlbN.js";const O={title:"GridForm / Static Tests",component:i,args:{}},m=s=>{const r=[["No options",{options:[]}],["Custom no options",{options:[],noOptionsMessage:"Custom no options"}],["Enabled and disabled",{options:[{label:"Enabled",value:1},{label:"Disabled",value:0,disabled:!0}]}],["Headers",{options:[e("Header 1"),{label:"Option 1",value:1},e("Header 2"),{label:"Option 2",value:2}]}],["Filter",{filtered:"local",options:[e("Header 1"),{label:"Option 1",value:1},e("Header 2"),{label:"Option 2",value:2}]}],["Filter custom placeholder",{filtered:"local",filterPlaceholder:"Custom placeholder",filterHelpText:"Filter help text",options:[e("Header 1"),{label:"Option 1",value:1}]}],["Filter help text and default filter text",{filtered:"local",filterHelpText:"Filter help text",filterDefaultValue:"filter",options:[e("Header 1"),{label:"Filter match",value:1},e("ERROR! this header should not be visible"),{label:"ERROR! this option should not be visible",value:2}]}]],a=r.map(()=>u.useRef(null));return n.jsx("div",{className:"react-menu-inline-test",children:n.jsx(d,{children:r.map((o,l)=>n.jsxs("div",{children:[n.jsx("h6",{ref:a[l],children:o[0]}),n.jsx(p.Provider,{value:{anchorRef:a[l],data:{value:o[2]},value:o[2],field:"value"},children:n.jsx(i,{...s,...o[1]})})]},`${l}`))})})},t=m.bind({});t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(props: GridFormDropDownProps<any>) => {
  const configs: [string, GridFormDropDownProps<GridBaseRow>, string?][] = [["No options", {
    options: []
  }], ["Custom no options", {
    options: [],
    noOptionsMessage: "Custom no options"
  }], ["Enabled and disabled", {
    options: [{
      label: "Enabled",
      value: 1
    }, {
      label: "Disabled",
      value: 0,
      disabled: true
    }]
  }], ["Headers", {
    options: [MenuHeaderItem("Header 1"), {
      label: "Option 1",
      value: 1
    }, MenuHeaderItem("Header 2"), {
      label: "Option 2",
      value: 2
    }]
  }], ["Filter", {
    filtered: "local",
    options: [MenuHeaderItem("Header 1"), {
      label: "Option 1",
      value: 1
    }, MenuHeaderItem("Header 2"), {
      label: "Option 2",
      value: 2
    }]
  }], ["Filter custom placeholder", {
    filtered: "local",
    filterPlaceholder: "Custom placeholder",
    filterHelpText: "Filter help text",
    options: [MenuHeaderItem("Header 1"), {
      label: "Option 1",
      value: 1
    }]
  }], ["Filter help text and default filter text", {
    filtered: "local",
    filterHelpText: "Filter help text",
    filterDefaultValue: "filter",
    options: [MenuHeaderItem("Header 1"), {
      label: "Filter match",
      value: 1
    }, MenuHeaderItem("ERROR! this header should not be visible"), {
      label: "ERROR! this option should not be visible",
      value: 2
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
              <GridFormDropDown {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </div>)}
      </GridContextProvider>
    </div>;
}`,...t.parameters?.docs?.source}}};const G=["GridFormDropDown_"];export{t as GridFormDropDown_,G as __namedExportsOrder,O as default};
