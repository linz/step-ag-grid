import{j as e}from"./util-C4ixyLy7.js";/* empty css              *//* empty css              */import"./stateDeferredHook-CUysfGJv.js";import{i as s,D as p}from"./GridWrapper-eiB1XGEh.js";import{r as d}from"./iframe-C7YdmbKE.js";import"./Grid-BeshNyiE.js";import{a as c}from"./GridUpdatingContextProvider-BVMWCOYG.js";import"./ActionButton-BQGpH5bP.js";import"./index-DMAE8YrU.js";import"./preload-helper-PPVm8Dsz.js";const C={title:"GridForm / Static Tests",component:s,args:{}},m=a=>{const o=[["Text input",{}],["Text input with text",{},"Some text"],["Text input with error & placeholder",{required:!0,placeholder:"Custom placeholder"}]],n=o.map(()=>d.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(c,{children:o.map((t,i)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[i],children:t[0]}),e.jsx(p.Provider,{value:{anchorRef:n[i],value:t[2]},children:e.jsx(s,{...a,...t[1]})})]}))})})},r=m.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormTextInputProps<any>) => {
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
}`,...r.parameters?.docs?.source}}};const F=["GridFormTextInput_"];export{r as GridFormTextInput_,F as __namedExportsOrder,C as default};
