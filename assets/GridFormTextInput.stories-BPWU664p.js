import{j as e}from"./util-CgugAU5W.js";/* empty css              *//* empty css              */import"./stateDeferredHook-DLMcti5_.js";import{i as s,I as p}from"./GridWrapper-ByjUL_3E.js";import{r as d}from"./iframe-qoNDcQrb.js";import"./Grid-vjV2ljNn.js";import"./client-DIuOxkbO.js";import{a as m}from"./GridUpdatingContextProvider-CR4twmSI.js";import"./ActionButton-CzX0v5O0.js";import"./index-2kSpQblA.js";import"./preload-helper-PPVm8Dsz.js";const F={title:"GridForm / Static Tests",component:s,args:{}},c=a=>{const o=[["Text input",{}],["Text input with text",{},"Some text"],["Text input with error & placeholder",{required:!0,placeholder:"Custom placeholder"}]],n=o.map(()=>d.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(m,{children:o.map((t,i)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[i],children:t[0]}),e.jsx(p.Provider,{value:{anchorRef:n[i],value:t[2]},children:e.jsx(s,{...a,...t[1]})})]}))})})},r=c.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormTextInputProps<any>) => {
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
}`,...r.parameters?.docs?.source}}};const j=["GridFormTextInput_"];export{r as GridFormTextInput_,j as __namedExportsOrder,F as default};
