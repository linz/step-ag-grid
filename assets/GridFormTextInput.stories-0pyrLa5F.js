import{j as e}from"./index-uvRZkhe0.js";/* empty css              */import{a as p}from"./GridUpdatingContextProvider-Cl4YAuE6.js";import"./stateDeferredHook-Dh_hbzWK.js";import{B as s,q as d}from"./GridWrapper-DPDU43au.js";import{r as c}from"./index-DQDNmYQF.js";import"./Grid-C5I1boQ6.js";import"./util-CYV73bPB.js";import"./ActionButton-BDYCoy1d.js";import"./index-DYVtDik4.js";const R={title:"GridForm / Static Tests",component:s,args:{}},m=a=>{const o=[["Text input",{}],["Text input with text",{},"Some text"],["Text input with error & placeholder",{required:!0,placeholder:"Custom placeholder"}]],n=o.map(()=>c.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(p,{children:o.map((t,i)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[i],children:t[0]}),e.jsx(d.Provider,{value:{anchorRef:n[i],value:t[2]},children:e.jsx(s,{...a,...t[1]})})]}))})})},r=m.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormTextInputProps<any>) => {
  const configs: [string, GridFormTextInputProps<GridBaseRow>, string?][] = [['Text input', {}], ['Text input with text', {}, 'Some text'], ['Text input with error & placeholder', {
    required: true,
    placeholder: 'Custom placeholder'
  }]];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = configs.map(() => useRef<HTMLHeadingElement>(null));
  return <div className={'react-menu-inline-test'}>
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
}`,...r.parameters?.docs?.source}}};const C=["GridFormTextInput_"];export{r as GridFormTextInput_,C as __namedExportsOrder,R as default};
