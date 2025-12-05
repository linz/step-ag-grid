import{j as e}from"./util-Do7DUC2X.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{m as i,I as d}from"./GridWrapper-BAUk9ZaG.js";import{r as m}from"./iframe-fuNulc0f.js";import"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{a as c}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const F={title:"GridForm / Static Tests",component:i,args:{}},p=s=>{const t=[["Text area",{}],["Text area with text",{},"Some text"],["Text area with error & placeholder",{required:!0,placeholder:"Custom placeholder"}]],n=t.map(()=>m.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(c,{children:t.map((o,a)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[a],children:o[0]}),e.jsx(d.Provider,{value:{anchorRef:n[a],value:o[2]},children:e.jsx(i,{...s,...o[1]})})]}))})})},r=p.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormTextAreaProps<any>) => {
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
