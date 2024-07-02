import{j as e}from"./jsx-runtime-QvZ8i92b.js";/* empty css              */import{a as n}from"./GridUpdatingContextProvider-B57ju6NF.js";import"./stateDeferredHook-3pr3Jmby.js";import{m as t}from"./GridWrapper-DJOqlb4b.js";import{r as i}from"./index-uubelm5h.js";import"./Grid-CzMsKtE0.js";import"./index-CMOtJUyO.js";import"./util-BMTC4KOK.js";import{G as o}from"./GridFormMessage-CYwv8QhC.js";import"./ActionButton-CKl6PlbN.js";const P={title:"GridForm / Static Tests",component:o,args:{}},m=a=>{const s=i.useRef(null);return e.jsx("div",{className:"react-menu-inline-test",children:e.jsxs(n,{children:[e.jsx("h6",{ref:s,children:"Standard Message"}),e.jsx(t.Provider,{value:{anchorRef:s},children:e.jsx(o,{...a,message:()=>e.jsx("span",{children:"This is a message"})})})]})})},r=m.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormMessageProps<any>) => {
  const anchorRef1 = useRef<HTMLHeadingElement>(null);
  return <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        <h6 ref={anchorRef1}>Standard Message</h6>
        <GridPopoverContext.Provider value={(({
        anchorRef: anchorRef1
      } as any) as GridPopoverContextType<any>)}>
          <GridFormMessage {...props} message={() => <span>This is a message</span>} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>;
}`,...r.parameters?.docs?.source}}};const M=["GridFormMessage_"];export{r as GridFormMessage_,M as __namedExportsOrder,P as default};
