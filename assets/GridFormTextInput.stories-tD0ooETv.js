import{j as e}from"./jsx-runtime-QvZ8i92b.js";/* empty css              */import{a as p}from"./GridUpdatingContextProvider-B57ju6NF.js";import"./stateDeferredHook-3pr3Jmby.js";import{m as d}from"./GridWrapper-DJOqlb4b.js";import{r as m}from"./index-uubelm5h.js";import"./Grid-CzMsKtE0.js";import"./index-CMOtJUyO.js";import"./util-BMTC4KOK.js";import{G as s}from"./GridFormTextInput-Dcs3CXlU.js";import"./ActionButton-CKl6PlbN.js";const C={title:"GridForm / Static Tests",component:s,args:{}},c=a=>{const o=[["Text input",{}],["Text input with text",{},"Some text"],["Text input with error & placeholder",{required:!0,placeholder:"Custom placeholder"}]],n=o.map(()=>m.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(p,{children:o.map((t,i)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[i],children:t[0]}),e.jsx(d.Provider,{value:{anchorRef:n[i],value:t[2]},children:e.jsx(s,{...a,...t[1]})})]}))})})},r=c.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormTextInputProps<any>) => {
  const configs: [string, GridFormTextInputProps<GridBaseRow>, string?][] = [["Text input", {}], ["Text input with text", {}, "Some text"], ["Text input with error & placeholder", {
    required: true,
    placeholder: "Custom placeholder"
  }]];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = configs.map(() => useRef<HTMLHeadingElement>(null));
  return <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        {configs.map((config, index) => <>
            <h6 ref={anchorRefs[index]}>{config[0]}</h6>
            <GridPopoverContext.Provider value={(({
          anchorRef: anchorRefs[index],
          value: config[2]
        } as any) as GridPopoverContextType<any>)}>
              <GridFormTextInput {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>)}
      </GridContextProvider>
    </div>;
}`,...r.parameters?.docs?.source}}};const F=["GridFormTextInput_"];export{r as GridFormTextInput_,F as __namedExportsOrder,C as default};
