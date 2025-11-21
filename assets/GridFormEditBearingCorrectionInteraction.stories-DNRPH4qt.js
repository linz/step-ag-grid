import{j as o}from"./util-B1lB3GhT.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Cj269tWz.js";import{J as d,I as l}from"./GridWrapper-DtoEoUNi.js";import{r as c}from"./iframe-smKoh4tb.js";import"./Grid-Q3rFMtHJ.js";import"./client-Kh56r61r.js";import{b as m}from"./GridPopoverEditBearing-F9aIpcdE.js";import{a as p}from"./GridUpdatingContextProvider-qT4OMujP.js";import"./ActionButton-Bm-II8tU.js";import"./index-WFabMzKZ.js";import"./preload-helper-PPVm8Dsz.js";const{expect:e,fn:u,userEvent:r,within:v}=__STORYBOOK_MODULE_TEST__,b={title:"GridForm / Interactions",component:d,args:{}},t=u(),h=s=>{const n=c.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(p,{children:[o.jsx("h6",{ref:n,children:"Interaction Test"}),o.jsx(l.Provider,{value:{anchorRef:n,colId:"",value:null,updateValue:t,formatValue:a=>a,setSaving:()=>{},saving:!1,selectedRows:[],data:{value:""},field:"value",stopEditing:()=>{}},children:o.jsx(d,{...s,...m})})]})})},i=h.bind({});i.play=async({canvasElement:s})=>{const n=v(s);e(await n.findByText("Press enter or tab to save")).toBeInTheDocument();const a=n.getByPlaceholderText("Enter bearing correction");e(await n.findByText("–")).toBeInTheDocument(),e(a).toBeInTheDocument(),await r.type(a,"1.2345"),e(await n.findByText(`+1° 23' 45"`)).toBeInTheDocument(),t.mockClear(),await r.type(a,"{Enter}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await r.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await r.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await r.type(a,"{Escape}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await r.type(a,"xxx"),e(await n.findByText("?")).toBeInTheDocument(),e(n.getByText("Bearing must be a number in D.MMSSS format")).toBeInTheDocument(),await r.type(a,"{Enter}"),e(t).not.toHaveBeenCalled(),await r.tab(),e(t).not.toHaveBeenCalled(),await r.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
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
}`,...i.parameters?.docs?.source}}};const R=["GridFormEditBearingCorrectionInteractions_"];export{i as GridFormEditBearingCorrectionInteractions_,R as __namedExportsOrder,b as default};
