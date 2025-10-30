import{j as e}from"./util-ijFjlinu.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Du3IBcJj.js";import{O as o,D as n}from"./GridWrapper-BPNz-Kwc.js";import{r as t}from"./iframe-DlkmCGKI.js";import"./Grid-x2Pv4IEw.js";import"./client-iOTQfKt-.js";import{a as i}from"./GridUpdatingContextProvider-BzZAfXqp.js";import"./ActionButton-Ch-xL9UL.js";import"./index-cvdpWsZ8.js";import"./preload-helper-PPVm8Dsz.js";const M={title:"GridForm / Static Tests",component:o,args:{}},d=a=>{const s=t.useRef(null);return e.jsx("div",{className:"react-menu-inline-test",children:e.jsxs(i,{children:[e.jsx("h6",{ref:s,children:"Standard Message"}),e.jsx(n.Provider,{value:{anchorRef:s},children:e.jsx(o,{...a,message:()=>e.jsx("span",{children:"This is a message"})})})]})})},r=d.bind({});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridFormMessageProps<any>) => {
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
}`,...r.parameters?.docs?.source}}};const R=["GridFormMessage_"];export{r as GridFormMessage_,R as __namedExportsOrder,M as default};
