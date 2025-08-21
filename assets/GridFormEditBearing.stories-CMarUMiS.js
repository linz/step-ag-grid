import{j as r}from"./util-B6pJytQ4.js";/* empty css              */import{a as l}from"./GridUpdatingContextProvider-R8BvGmQD.js";import"./stateDeferredHook-Dvy6TW6N.js";import{C as t,B as d}from"./GridWrapper-C94wn5Fr.js";import{r as m}from"./iframe-BBeBoPQM.js";import"./Grid-CbECBfpJ.js";import{c as p}from"./GridPopoverEditBearing-BpnF-siL.js";import"./ActionButton-oJCgpU9B.js";import"./index-Ci9P-iYA.js";import"./preload-helper-Ct5FWWRu.js";const F={title:"GridForm / Static Tests",component:t,args:{}},c=s=>{const n=[["Null value",{},null],["Custom placeholder",{placeHolder:"Custom placeholder"},null],["Valid value",{},90],["With error",{},1.234567]],a=n.map(()=>m.useRef(null));return r.jsx("div",{className:"react-menu-inline-test",children:r.jsx(l,{children:n.map((o,i)=>r.jsxs(r.Fragment,{children:[r.jsx("h6",{ref:a[i],children:o[0]}),r.jsx(d.Provider,{value:{anchorRef:a[i],value:o[2]},children:r.jsx(t,{...s,...p,...o[1]})})]}))})})},e=c.bind({});e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
  const values: [string, GridFormEditBearingProps<any>, number | null][] = [['Null value', {}, null], ['Custom placeholder', {
    placeHolder: 'Custom placeholder'
  }, null], ['Valid value', {}, 90], ['With error', {}, 1.234567]];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = values.map(() => useRef<HTMLHeadingElement>(null));
  return <div className={'react-menu-inline-test'}>
      <GridContextProvider>
        {values.map((value, index) => <>
            <h6 ref={anchorRefs[index]}>{value[0]}</h6>
            <GridPopoverContext.Provider value={{
          anchorRef: anchorRefs[index],
          value: value[2]
        } as any as GridPopoverContextType<any>}>
              <GridFormEditBearing {...props} {...GridPopoverEditBearingEditorParams} {...value[1]} />
            </GridPopoverContext.Provider>
          </>)}
      </GridContextProvider>
    </div>;
}`,...e.parameters?.docs?.source}}};const R=["GridFormEditBearing_"];export{e as GridFormEditBearing_,R as __namedExportsOrder,F as default};
