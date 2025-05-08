import{j as e}from"./index-uvRZkhe0.js";/* empty css              */import{a as n}from"./GridUpdatingContextProvider-DYGM_UmY.js";import"./stateDeferredHook-Dh_hbzWK.js";import{y as o,q as t}from"./GridWrapper-KGmbnRqr.js";import{r as i}from"./index-DQDNmYQF.js";import"./Grid-Cf9uaoEg.js";import"./util-CYV73bPB.js";import"./ActionButton-BDYCoy1d.js";import"./index-DYVtDik4.js";const G={title:"GridForm / Static Tests",component:o,args:{}},d=a=>{const s=i.useRef(null);return e.jsx("div",{className:"react-menu-inline-test",children:e.jsxs(n,{children:[e.jsx("h6",{ref:s,children:"Standard Message"}),e.jsx(t.Provider,{value:{anchorRef:s},children:e.jsx(o,{...a,message:()=>e.jsx("span",{children:"This is a message"})})})]})})},r=d.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormMessageProps<any>) => {
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
