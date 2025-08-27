import{j as r}from"./util-D0ZPQILD.js";/* empty css              */import{a as l}from"./GridUpdatingContextProvider-Bf3uDJXf.js";import"./stateDeferredHook-CMmLGC-b.js";import{C as a,B as d}from"./GridWrapper-Dkr6AhEe.js";import{r as m}from"./iframe-DFgdmXXt.js";import"./Grid-Cl0RwgNy.js";import{b as c}from"./GridPopoverEditBearing-xWpTIvGp.js";import"./ActionButton-BhkOzu5T.js";import"./index-CGwqqGm4.js";import"./preload-helper-Ct5FWWRu.js";const F={title:"GridForm / Static Tests",component:a,args:{}},p=s=>{const n=[["Null value",{},null],["Custom placeholder",{placeHolder:"Custom placeholder"},null],["Valid value",{},-10],["With error",{},360]],i=n.map(()=>m.useRef(null));return r.jsx("div",{className:"react-menu-inline-test",children:r.jsx(l,{children:n.map((o,t)=>r.jsxs(r.Fragment,{children:[r.jsx("h6",{ref:i[t],children:o[0]}),r.jsx(d.Provider,{value:{anchorRef:i[t],value:o[2]},children:r.jsx(a,{...s,...c,...o[1]})})]}))})})},e=p.bind({});e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
  const values: [string, GridFormEditBearingProps<any>, number | null][] = [['Null value', {}, null], ['Custom placeholder', {
    placeHolder: 'Custom placeholder'
  }, null], ['Valid value', {}, -10], ['With error', {}, 360]];
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
              <GridFormEditBearing {...props} {...GridPopoverEditBearingCorrectionEditorParams} {...value[1]} />
            </GridPopoverContext.Provider>
          </>)}
      </GridContextProvider>
    </div>;
}`,...e.parameters?.docs?.source}}};const R=["GridFormEditBearingCorrection_"];export{e as GridFormEditBearingCorrection_,R as __namedExportsOrder,F as default};
