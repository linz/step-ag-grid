import{j as o}from"./util-ijFjlinu.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Du3IBcJj.js";import{i as l,D as d}from"./GridWrapper-BPNz-Kwc.js";import{r as c}from"./iframe-DlkmCGKI.js";import"./Grid-x2Pv4IEw.js";import"./client-iOTQfKt-.js";import{a as u}from"./GridUpdatingContextProvider-BzZAfXqp.js";import"./ActionButton-Ch-xL9UL.js";import"./index-cvdpWsZ8.js";import"./preload-helper-PPVm8Dsz.js";const{expect:e,fn:p,userEvent:n,within:m}=__STORYBOOK_MODULE_TEST__,P={title:"GridForm / Interactions",component:l,args:{}},t=p(),v=s=>{const a=c.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(u,{children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(d.Provider,{value:{anchorRef:a,value:null,updateValue:t,data:{value:null},colId:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:r=>r,stopEditing:()=>{}},children:o.jsx(l,{...s,required:!0})})]})})},i=v.bind({});i.play=async({canvasElement:s})=>{const a=m(s);e(await a.findByText("Must not be empty")).toBeInTheDocument();const r=a.getByPlaceholderText("Type here");await n.type(r,"Hello"),e(a.getByText("Press enter or tab to save")).toBeInTheDocument(),t.mockClear(),await n.type(r,"{Enter}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(r,"{Escape}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await n.clear(r),e(a.getByText("Must not be empty")).toBeInTheDocument(),await n.type(r,"{Enter}"),e(t).not.toHaveBeenCalled(),await n.tab(),e(t).not.toHaveBeenCalled(),await n.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormTextInputProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={'react-menu-inline-test'}>
      <GridContextProvider>
        <h6 ref={anchorRef}>Interaction Test</h6>
        <GridPopoverContext.Provider value={{
        anchorRef,
        value: null,
        updateValue,
        data: {
          value: null
        },
        colId: '',
        field: 'value',
        selectedRows: [],
        saving: false,
        setSaving: () => {},
        formatValue: value => value,
        stopEditing: () => {}
      }}>
          <GridFormTextInput {...props} required={true} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>;
}`,...i.parameters?.docs?.source}}};const _=["GridFormTextInputInteractions_"];export{i as GridFormTextInputInteractions_,_ as __namedExportsOrder,P as default};
