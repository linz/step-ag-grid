import{j as r}from"./util-C4ixyLy7.js";/* empty css              *//* empty css              */import"./stateDeferredHook-CUysfGJv.js";import{H as t,D as l}from"./GridWrapper-eiB1XGEh.js";import{r as d}from"./iframe-C7YdmbKE.js";import"./Grid-BeshNyiE.js";import{c as m}from"./GridPopoverEditBearing-BHFFAoYy.js";import{a as p}from"./GridUpdatingContextProvider-BVMWCOYG.js";import"./ActionButton-BQGpH5bP.js";import"./index-DMAE8YrU.js";import"./preload-helper-PPVm8Dsz.js";const R={title:"GridForm / Static Tests",component:t,args:{}},c=s=>{const n=[["Null value",{},null],["Custom placeholder",{placeHolder:"Custom placeholder"},null],["Valid value",{},90],["With error",{},1.234567]],i=n.map(()=>d.useRef(null));return r.jsx("div",{className:"react-menu-inline-test",children:r.jsx(p,{children:n.map((o,a)=>r.jsxs(r.Fragment,{children:[r.jsx("h6",{ref:i[a],children:o[0]}),r.jsx(l.Provider,{value:{anchorRef:i[a],value:o[2]},children:r.jsx(t,{...s,...m,...o[1]})})]}))})})},e=c.bind({});e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
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
}`,...e.parameters?.docs?.source}}};const j=["GridFormEditBearing_"];export{e as GridFormEditBearing_,j as __namedExportsOrder,R as default};
