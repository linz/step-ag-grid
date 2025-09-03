import{j as o}from"./util-eZhZbfsr.js";/* empty css              */import{C as d,B as l}from"./GridWrapper-BQp-g5Ca.js";import"./stateDeferredHook-DITQGBk8.js";import{r as c}from"./iframe-DPaswKtK.js";import{b as m}from"./Grid-rACfpCEn.js";import{b as u}from"./GridPopoverEditBearing-CRRG6pID.js";import"./GridUpdatingContextProvider-QXyZC2KO.js";import"./ActionButton-DvHFrPXG.js";import"./index-DlFCgIiE.js";import"./preload-helper-Ct5FWWRu.js";const{expect:e,fn:p,userEvent:a,within:v}=__STORYBOOK_MODULE_TEST__,I={title:"GridForm / Interactions",component:d,args:{}},t=p(),B=s=>{const n=c.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(m.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:n,children:"Interaction Test"}),o.jsx(l.Provider,{value:{anchorRef:n,colId:"",value:null,updateValue:t,formatValue:r=>r,setSaving:()=>{},saving:!1,selectedRows:[],data:{value:""},field:"value"},children:o.jsx(d,{...s,...u})})]})})},i=B.bind({});i.play=async({canvasElement:s})=>{const n=v(s);e(await n.findByText("Press enter or tab to save")).toBeInTheDocument();const r=n.getByPlaceholderText("Enter bearing correction");e(await n.findByText("–")).toBeInTheDocument(),e(r).toBeInTheDocument(),await a.type(r,"1.2345"),e(await n.findByText(`+1° 23' 45"`)).toBeInTheDocument(),t.mockClear(),await a.type(r,"{Enter}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await a.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await a.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await a.type(r,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await a.type(r,"xxx"),e(await n.findByText("?")).toBeInTheDocument(),e(n.getByText("Bearing must be a number in D.MMSSS format")).toBeInTheDocument(),await a.type(r,"{Enter}"),e(t).not.toHaveBeenCalled(),await a.tab(),e(t).not.toHaveBeenCalled(),await a.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={'react-menu-inline-test'}>
      <GridContext.Provider value={{
      stopEditing: () => {},
      cancelEdit: () => {}
    } as any}>
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
        field: 'value'
      }}>
          <GridFormEditBearing {...props} {...GridPopoverEditBearingCorrectionEditorParams} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...i.parameters?.docs?.source}}};const b=["GridFormEditBearingCorrectionInteractions_"];export{i as GridFormEditBearingCorrectionInteractions_,b as __namedExportsOrder,I as default};
