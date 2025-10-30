import{j as o}from"./util-ijFjlinu.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Du3IBcJj.js";import{H as d,D as l}from"./GridWrapper-BPNz-Kwc.js";import{r as c}from"./iframe-DlkmCGKI.js";import"./Grid-x2Pv4IEw.js";import"./client-iOTQfKt-.js";import{b as m}from"./GridPopoverEditBearing-CEifd9bN.js";import{a as p}from"./GridUpdatingContextProvider-BzZAfXqp.js";import"./ActionButton-Ch-xL9UL.js";import"./index-cvdpWsZ8.js";import"./preload-helper-PPVm8Dsz.js";const{expect:e,fn:u,userEvent:r,within:v}=__STORYBOOK_MODULE_TEST__,b={title:"GridForm / Interactions",component:d,args:{}},t=u(),h=s=>{const n=c.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(p,{children:[o.jsx("h6",{ref:n,children:"Interaction Test"}),o.jsx(l.Provider,{value:{anchorRef:n,colId:"",value:null,updateValue:t,formatValue:a=>a,setSaving:()=>{},saving:!1,selectedRows:[],data:{value:""},field:"value",stopEditing:()=>{}},children:o.jsx(d,{...s,...m})})]})})},i=h.bind({});i.play=async({canvasElement:s})=>{const n=v(s);e(await n.findByText("Press enter or tab to save")).toBeInTheDocument();const a=n.getByPlaceholderText("Enter bearing correction");e(await n.findByText("–")).toBeInTheDocument(),e(a).toBeInTheDocument(),await r.type(a,"1.2345"),e(await n.findByText(`+1° 23' 45"`)).toBeInTheDocument(),t.mockClear(),await r.type(a,"{Enter}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await r.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await r.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await r.type(a,"{Escape}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await r.type(a,"xxx"),e(await n.findByText("?")).toBeInTheDocument(),e(n.getByText("Bearing must be a number in D.MMSSS format")).toBeInTheDocument(),await r.type(a,"{Enter}"),e(t).not.toHaveBeenCalled(),await r.tab(),e(t).not.toHaveBeenCalled(),await r.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={'react-menu-inline-test'}>
      <GridContextProvider>
        <h6 ref={anchorRef}>Interaction Test</h6>
        <GridPopoverContext.Provider value={{
        anchorRef,
        colId: '',
        value: null,
        updateValue,
        formatValue: value => value,
        setSaving: () => {},
        saving: false,
        selectedRows: [],
        data: {
          value: ''
        },
        field: 'value',
        stopEditing: () => {}
      }}>
          <GridFormEditBearing {...props} {...GridPopoverEditBearingCorrectionEditorParams} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>;
}`,...i.parameters?.docs?.source}}};const H=["GridFormEditBearingCorrectionInteractions_"];export{i as GridFormEditBearingCorrectionInteractions_,H as __namedExportsOrder,b as default};
