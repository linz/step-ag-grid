import{j as e}from"./jsx-runtime-DEdD30eg.js";/* empty css              */import{a as p}from"./GridUpdatingContextProvider-CLl46RM8.js";import"./stateDeferredHook-DIITot2w.js";import{m as d}from"./GridWrapper-DSHsENPw.js";import{r as m}from"./index-RYns6xqu.js";import"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import"./util-CWqzvxZb.js";import{G as s}from"./GridFormTextInput-Dfw5b7ML.js";import"./ActionButton-BnaFCZwL.js";const C={title:"GridForm / Static Tests",component:s,args:{}},c=a=>{const o=[["Text input",{}],["Text input with text",{},"Some text"],["Text input with error & placeholder",{required:!0,placeholder:"Custom placeholder"}]],n=o.map(()=>m.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(p,{children:o.map((t,i)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[i],children:t[0]}),e.jsx(d.Provider,{value:{anchorRef:n[i],value:t[2]},children:e.jsx(s,{...a,...t[1]})})]}))})})},r=c.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormTextInputProps<any>) => {
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
            <GridPopoverContext.Provider value={{
          anchorRef: anchorRefs[index],
          value: config[2]
        } as any as GridPopoverContextType<any>}>
              <GridFormTextInput {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>)}
      </GridContextProvider>
    </div>;
}`,...r.parameters?.docs?.source}}};const F=["GridFormTextInput_"];export{r as GridFormTextInput_,F as __namedExportsOrder,C as default};
