import{j as e}from"./util-eZhZbfsr.js";/* empty css              */import{L as o,B as n}from"./GridWrapper-BQp-g5Ca.js";import"./stateDeferredHook-DITQGBk8.js";import{r as t}from"./iframe-DPaswKtK.js";import"./Grid-rACfpCEn.js";import{a as i}from"./GridUpdatingContextProvider-QXyZC2KO.js";import"./ActionButton-DvHFrPXG.js";import"./index-DlFCgIiE.js";import"./preload-helper-Ct5FWWRu.js";const G={title:"GridForm / Static Tests",component:o,args:{}},d=a=>{const s=t.useRef(null);return e.jsx("div",{className:"react-menu-inline-test",children:e.jsxs(i,{children:[e.jsx("h6",{ref:s,children:"Standard Message"}),e.jsx(n.Provider,{value:{anchorRef:s},children:e.jsx(o,{...a,message:()=>e.jsx("span",{children:"This is a message"})})})]})})},r=d.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormMessageProps<any>) => {
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
