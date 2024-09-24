import{j as e}from"./jsx-runtime-DEdD30eg.js";/* empty css              */import{a as d}from"./GridUpdatingContextProvider-C0OJ_AZp.js";import"./stateDeferredHook-DIITot2w.js";import{m}from"./GridWrapper-y58xtKL0.js";import{r as c}from"./index-RYns6xqu.js";import"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import"./util-CWqzvxZb.js";import{G as i}from"./GridFormTextArea-teTdy3sf.js";import"./ActionButton-BnaFCZwL.js";const C={title:"GridForm / Static Tests",component:i,args:{}},p=s=>{const t=[["Text area",{}],["Text area with text",{},"Some text"],["Text area with error & placeholder",{required:!0,placeholder:"Custom placeholder"}]],n=t.map(()=>c.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(d,{children:t.map((o,a)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[a],children:o[0]}),e.jsx(m.Provider,{value:{anchorRef:n[a],value:o[2]},children:e.jsx(i,{...s,...o[1]})})]}))})})},r=p.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormTextAreaProps<any>) => {
  const configs: [string, GridFormTextAreaProps<GridBaseRow>, string?][] = [["Text area", {}], ["Text area with text", {}, "Some text"], ["Text area with error & placeholder", {
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
              <GridFormTextArea {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>)}
      </GridContextProvider>
    </div>;
}`,...r.parameters?.docs?.source}}};const F=["GridFormTextArea_"];export{r as GridFormTextArea_,F as __namedExportsOrder,C as default};
