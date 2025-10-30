import{j as o}from"./util-ijFjlinu.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Du3IBcJj.js";import{k as l,D as d}from"./GridWrapper-BPNz-Kwc.js";import{r as c}from"./iframe-DlkmCGKI.js";import"./Grid-x2Pv4IEw.js";import"./client-iOTQfKt-.js";import{a as m}from"./GridUpdatingContextProvider-BzZAfXqp.js";import"./ActionButton-Ch-xL9UL.js";import"./index-cvdpWsZ8.js";import"./preload-helper-PPVm8Dsz.js";const{expect:e,fn:u,userEvent:a,within:p}=__STORYBOOK_MODULE_TEST__,_={title:"GridForm / Interactions",component:l,args:{}},t=u(),v=s=>{const r=c.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(m,{children:[o.jsx("h6",{ref:r,children:"Interaction Test"}),o.jsx(d.Provider,{value:{anchorRef:r,value:null,updateValue:t,data:{value:null},colId:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:n=>n,stopEditing:()=>{}},children:o.jsx(l,{...s,required:!0})})]})})},i=v.bind({});i.play=async({canvasElement:s})=>{const r=p(s);e(await r.findByText("Must not be empty")).toBeInTheDocument();const n=r.getByPlaceholderText("Type here");await a.type(n,"Hello"),e(await r.findByText("Press tab to save")).toBeInTheDocument(),t.mockClear(),await a.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await a.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await a.type(n,"{Escape}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await a.clear(n),e(r.getByText("Must not be empty")).toBeInTheDocument(),await a.tab(),e(t).not.toHaveBeenCalled(),await a.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormTextAreaProps<any>) => {
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
          <GridFormTextArea {...props} required={true} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>;
}`,...i.parameters?.docs?.source}}};const E=["GridFormTextAreaInteractions_"];export{i as GridFormTextAreaInteractions_,E as __namedExportsOrder,_ as default};
