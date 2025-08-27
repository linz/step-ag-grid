import{j as e}from"./util-D0ZPQILD.js";/* empty css              */import{a as n}from"./GridUpdatingContextProvider-Bf3uDJXf.js";import"./stateDeferredHook-CMmLGC-b.js";import{L as o,B as t}from"./GridWrapper-Dkr6AhEe.js";import{r as i}from"./iframe-DFgdmXXt.js";import"./Grid-Cl0RwgNy.js";import"./ActionButton-BhkOzu5T.js";import"./index-CGwqqGm4.js";import"./preload-helper-Ct5FWWRu.js";const G={title:"GridForm / Static Tests",component:o,args:{}},d=a=>{const s=i.useRef(null);return e.jsx("div",{className:"react-menu-inline-test",children:e.jsxs(n,{children:[e.jsx("h6",{ref:s,children:"Standard Message"}),e.jsx(t.Provider,{value:{anchorRef:s},children:e.jsx(o,{...a,message:()=>e.jsx("span",{children:"This is a message"})})})]})})},r=d.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormMessageProps<any>) => {
  const anchorRef1 = useRef<HTMLHeadingElement>(null);
  return <div className={'react-menu-inline-test'}>
      <GridContextProvider>
        <h6 ref={anchorRef1}>Standard Message</h6>
        <GridPopoverContext.Provider value={{
        anchorRef: anchorRef1
      } as any as GridPopoverContextType<any>}>
          <GridFormMessage {...props} message={() => <span>This is a message</span>} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>;
}`,...r.parameters?.docs?.source}}};const P=["GridFormMessage_"];export{r as GridFormMessage_,P as __namedExportsOrder,G as default};
