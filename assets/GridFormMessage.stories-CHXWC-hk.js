import{j as e}from"./util-Bgyi09Ip.js";/* empty css              */import{a as n}from"./GridUpdatingContextProvider-Cm1Mh2ke.js";import"./stateDeferredHook-D_TYtWjH.js";import{L as o,B as t}from"./GridWrapper-BpIAkRfq.js";import{r as i}from"./iframe-DxqxLvC4.js";import"./Grid-VK9dZD2m.js";import"./ActionButton-BukOjtns.js";import"./index-CG3c8ksy.js";import"./preload-helper-Ct5FWWRu.js";const G={title:"GridForm / Static Tests",component:o,args:{}},d=a=>{const s=i.useRef(null);return e.jsx("div",{className:"react-menu-inline-test",children:e.jsxs(n,{children:[e.jsx("h6",{ref:s,children:"Standard Message"}),e.jsx(t.Provider,{value:{anchorRef:s},children:e.jsx(o,{...a,message:()=>e.jsx("span",{children:"This is a message"})})})]})})},r=d.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormMessageProps<any>) => {
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
