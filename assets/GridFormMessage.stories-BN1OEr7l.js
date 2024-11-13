import{j as e}from"./jsx-runtime-DEdD30eg.js";/* empty css              */import{a as n}from"./GridUpdatingContextProvider-CLl46RM8.js";import"./stateDeferredHook-DIITot2w.js";import{m as t}from"./GridWrapper-DSHsENPw.js";import{r as i}from"./index-RYns6xqu.js";import"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import"./util-CWqzvxZb.js";import{G as o}from"./GridFormMessage-BNJI7QrS.js";import"./ActionButton-BnaFCZwL.js";const P={title:"GridForm / Static Tests",component:o,args:{}},m=a=>{const s=i.useRef(null);return e.jsx("div",{className:"react-menu-inline-test",children:e.jsxs(n,{children:[e.jsx("h6",{ref:s,children:"Standard Message"}),e.jsx(t.Provider,{value:{anchorRef:s},children:e.jsx(o,{...a,message:()=>e.jsx("span",{children:"This is a message"})})})]})})},r=m.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormMessageProps<any>) => {
  const anchorRef1 = useRef<HTMLHeadingElement>(null);
  return <div className={"react-menu-inline-test"}>
      <GridContextProvider>
        <h6 ref={anchorRef1}>Standard Message</h6>
        <GridPopoverContext.Provider value={{
        anchorRef: anchorRef1
      } as any as GridPopoverContextType<any>}>
          <GridFormMessage {...props} message={() => <span>This is a message</span>} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>;
}`,...r.parameters?.docs?.source}}};const M=["GridFormMessage_"];export{r as GridFormMessage_,M as __namedExportsOrder,P as default};
