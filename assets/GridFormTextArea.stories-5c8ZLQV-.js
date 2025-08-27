import{j as e}from"./util-D0ZPQILD.js";/* empty css              */import{a as d}from"./GridUpdatingContextProvider-Bf3uDJXf.js";import"./stateDeferredHook-CMmLGC-b.js";import{k as i,B as c}from"./GridWrapper-Dkr6AhEe.js";import{r as m}from"./iframe-DFgdmXXt.js";import"./Grid-Cl0RwgNy.js";import"./ActionButton-BhkOzu5T.js";import"./index-CGwqqGm4.js";import"./preload-helper-Ct5FWWRu.js";const R={title:"GridForm / Static Tests",component:i,args:{}},p=s=>{const t=[["Text area",{}],["Text area with text",{},"Some text"],["Text area with error & placeholder",{required:!0,placeholder:"Custom placeholder"}]],n=t.map(()=>m.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(d,{children:t.map((o,a)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[a],children:o[0]}),e.jsx(c.Provider,{value:{anchorRef:n[a],value:o[2]},children:e.jsx(i,{...s,...o[1]})})]}))})})},r=p.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormTextAreaProps<any>) => {
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
}`,...r.parameters?.docs?.source}}};const C=["GridFormTextArea_"];export{r as GridFormTextArea_,C as __namedExportsOrder,R as default};
