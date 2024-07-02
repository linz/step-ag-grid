import{j as r}from"./jsx-runtime-QvZ8i92b.js";/* empty css              */import{a as l}from"./GridUpdatingContextProvider-B57ju6NF.js";import"./stateDeferredHook-3pr3Jmby.js";import{m as d}from"./GridWrapper-DJOqlb4b.js";import{r as m}from"./index-uubelm5h.js";import"./Grid-CzMsKtE0.js";import"./index-CMOtJUyO.js";import"./util-BMTC4KOK.js";import{b as t,d as p}from"./GridPopoverEditBearing-DsF1VYO8.js";import"./ActionButton-CKl6PlbN.js";const F={title:"GridForm / Static Tests",component:t,args:{}},u=s=>{const n=[["Null value",{},null],["Custom placeholder",{placeHolder:"Custom placeholder"},null],["Valid value",{},90],["With error",{},1.234567]],a=n.map(()=>m.useRef(null));return r.jsx("div",{className:"react-menu-inline-test",children:r.jsx(l,{children:n.map((o,i)=>r.jsxs(r.Fragment,{children:[r.jsx("h6",{ref:a[i],children:o[0]}),r.jsx(d.Provider,{value:{anchorRef:a[i],value:o[2]},children:r.jsx(t,{...s,...p,...o[1]})})]}))})})},e=u.bind({});e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
  const values: [string, GridFormEditBearingProps<any>, number | null][] = [["Null value", {}, null], ["Custom placeholder", {
    placeHolder: "Custom placeholder"
  }, null], ["Valid value", {}, 90], ["With error", {}, 1.234567]];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anchorRefs = values.map(() => useRef<HTMLHeadingElement>(null));
  return <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        {values.map((value, index) => <>
            <h6 ref={anchorRefs[index]}>{value[0]}</h6>
            <GridPopoverContext.Provider value={(({
          anchorRef: anchorRefs[index],
          value: value[2]
        } as any) as GridPopoverContextType<any>)}>
              <GridFormEditBearing {...props} {...GridPopoverEditBearingEditorParams} {...value[1]} />
            </GridPopoverContext.Provider>
          </>)}
      </GridContextProvider>
    </div>;
}`,...e.parameters?.docs?.source}}};const R=["GridFormEditBearing_"];export{e as GridFormEditBearing_,R as __namedExportsOrder,F as default};
