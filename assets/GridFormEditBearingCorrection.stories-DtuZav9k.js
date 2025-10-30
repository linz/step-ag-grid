import{j as r}from"./util-ijFjlinu.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Du3IBcJj.js";import{H as a,D as l}from"./GridWrapper-BPNz-Kwc.js";import{r as d}from"./iframe-DlkmCGKI.js";import"./Grid-x2Pv4IEw.js";import"./client-iOTQfKt-.js";import{b as m}from"./GridPopoverEditBearing-CEifd9bN.js";import{a as p}from"./GridUpdatingContextProvider-BzZAfXqp.js";import"./ActionButton-Ch-xL9UL.js";import"./index-cvdpWsZ8.js";import"./preload-helper-PPVm8Dsz.js";const j={title:"GridForm / Static Tests",component:a,args:{}},c=s=>{const n=[["Null value",{},null],["Custom placeholder",{placeHolder:"Custom placeholder"},null],["Valid value",{},-10],["With error",{},360]],i=n.map(()=>d.useRef(null));return r.jsx("div",{className:"react-menu-inline-test",children:r.jsx(p,{children:n.map((o,t)=>r.jsxs(r.Fragment,{children:[r.jsx("h6",{ref:i[t],children:o[0]}),r.jsx(l.Provider,{value:{anchorRef:i[t],value:o[2]},children:r.jsx(a,{...s,...m,...o[1]})})]}))})})},e=c.bind({});e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
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
}`,...e.parameters?.docs?.source}}};const y=["GridFormEditBearingCorrection_"];export{e as GridFormEditBearingCorrection_,y as __namedExportsOrder,j as default};
