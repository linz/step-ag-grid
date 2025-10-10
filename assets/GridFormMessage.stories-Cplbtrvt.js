import{j as e}from"./util-C4ixyLy7.js";/* empty css              *//* empty css              */import"./stateDeferredHook-CUysfGJv.js";import{O as o,D as n}from"./GridWrapper-eiB1XGEh.js";import{r as t}from"./iframe-C7YdmbKE.js";import"./Grid-BeshNyiE.js";import{a as i}from"./GridUpdatingContextProvider-BVMWCOYG.js";import"./ActionButton-BQGpH5bP.js";import"./index-DMAE8YrU.js";import"./preload-helper-PPVm8Dsz.js";const P={title:"GridForm / Static Tests",component:o,args:{}},d=a=>{const s=t.useRef(null);return e.jsx("div",{className:"react-menu-inline-test",children:e.jsxs(i,{children:[e.jsx("h6",{ref:s,children:"Standard Message"}),e.jsx(n.Provider,{value:{anchorRef:s},children:e.jsx(o,{...a,message:()=>e.jsx("span",{children:"This is a message"})})})]})})},r=d.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormMessageProps<any>) => {
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
}`,...r.parameters?.docs?.source}}};const M=["GridFormMessage_"];export{r as GridFormMessage_,M as __namedExportsOrder,P as default};
