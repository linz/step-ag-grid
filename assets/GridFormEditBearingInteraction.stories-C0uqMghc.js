import{j as o}from"./util-B1lB3GhT.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Cj269tWz.js";import{J as d,I as l}from"./GridWrapper-DtoEoUNi.js";import{r as c}from"./iframe-smKoh4tb.js";import"./Grid-Q3rFMtHJ.js";import"./client-Kh56r61r.js";import{c as m}from"./GridPopoverEditBearing-F9aIpcdE.js";import{a as p}from"./GridUpdatingContextProvider-qT4OMujP.js";import"./ActionButton-Bm-II8tU.js";import"./index-WFabMzKZ.js";import"./preload-helper-PPVm8Dsz.js";const{expect:e,fn:u,userEvent:n,within:v}=__STORYBOOK_MODULE_TEST__,R={title:"GridForm / Interactions",component:d,args:{}},t=u(),h=s=>{const a=c.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(p,{children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(l.Provider,{value:{anchorRef:a,colId:"",value:null,updateValue:t,formatValue:r=>r,setSaving:()=>{},saving:!1,selectedRows:[],data:{value:""},field:"value",stopEditing:()=>{}},children:o.jsx(d,{...s,...m})})]})})},i=h.bind({});i.play=async({canvasElement:s})=>{const a=v(s);e(await a.findByText("Press enter or tab to save")).toBeInTheDocument();const r=a.getByPlaceholderText("Enter bearing");e(await a.findByText("–")).toBeInTheDocument(),e(r).toBeInTheDocument(),await n.type(r,"1.2345"),e(await a.findByText(`1° 23' 45"`)).toBeInTheDocument(),t.mockClear(),await n.type(r,"{Enter}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(r,"{Escape}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await n.type(r,"xxx"),e(await a.findByText("?")).toBeInTheDocument(),e(a.getByText("Bearing must be a number in D.MMSSS format")).toBeInTheDocument(),await n.type(r,"{Enter}"),e(t).not.toHaveBeenCalled(),await n.tab(),e(t).not.toHaveBeenCalled(),await n.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
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
          <GridFormEditBearing {...props} {...GridPopoverEditBearingEditorParams} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>;
}`,...i.parameters?.docs?.source}}};const b=["GridFormEditBearingInteractions_"];export{i as GridFormEditBearingInteractions_,b as __namedExportsOrder,R as default};
