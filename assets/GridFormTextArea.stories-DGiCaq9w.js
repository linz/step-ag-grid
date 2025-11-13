import{j as e}from"./util-CgugAU5W.js";/* empty css              *//* empty css              */import"./stateDeferredHook-DLMcti5_.js";import{k as i,I as d}from"./GridWrapper-ByjUL_3E.js";import{r as m}from"./iframe-qoNDcQrb.js";import"./Grid-vjV2ljNn.js";import"./client-DIuOxkbO.js";import{a as c}from"./GridUpdatingContextProvider-CR4twmSI.js";import"./ActionButton-CzX0v5O0.js";import"./index-2kSpQblA.js";import"./preload-helper-PPVm8Dsz.js";const F={title:"GridForm / Static Tests",component:i,args:{}},p=s=>{const t=[["Text area",{}],["Text area with text",{},"Some text"],["Text area with error & placeholder",{required:!0,placeholder:"Custom placeholder"}]],n=t.map(()=>m.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(c,{children:t.map((o,a)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[a],children:o[0]}),e.jsx(d.Provider,{value:{anchorRef:n[a],value:o[2]},children:e.jsx(i,{...s,...o[1]})})]}))})})},r=p.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormTextAreaProps<any>) => {
  const configs: [string, GridFormTextAreaProps<GridBaseRow>, string?][] = [['Text area', {}], ['Text area with text', {}, 'Some text'], ['Text area with error & placeholder', {
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
              <GridFormTextArea {...props} {...config[1]} />
            </GridPopoverContext.Provider>
          </>)}
      </GridContextProvider>
    </div>;
}`,...r.parameters?.docs?.source}}};const j=["GridFormTextArea_"];export{r as GridFormTextArea_,j as __namedExportsOrder,F as default};
