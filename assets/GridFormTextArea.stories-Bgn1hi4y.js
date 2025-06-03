import{j as e}from"./index-uvRZkhe0.js";/* empty css              */import{a as d}from"./GridUpdatingContextProvider-TUzqEau3.js";import"./stateDeferredHook-Dh_hbzWK.js";import{h as i,q as c}from"./GridWrapper-nASS91gz.js";import{r as m}from"./index-DQDNmYQF.js";import"./Grid-Gw6JH53N.js";import"./util-FCHWxW_t.js";import"./ActionButton-C0tjKgIQ.js";import"./index-DYVtDik4.js";const R={title:"GridForm / Static Tests",component:i,args:{}},p=s=>{const t=[["Text area",{}],["Text area with text",{},"Some text"],["Text area with error & placeholder",{required:!0,placeholder:"Custom placeholder"}]],n=t.map(()=>m.useRef(null));return e.jsx("div",{className:"react-menu-inline-test",children:e.jsx(d,{children:t.map((o,a)=>e.jsxs(e.Fragment,{children:[e.jsx("h6",{ref:n[a],children:o[0]}),e.jsx(c.Provider,{value:{anchorRef:n[a],value:o[2]},children:e.jsx(i,{...s,...o[1]})})]}))})})},r=p.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormTextAreaProps<any>) => {
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
