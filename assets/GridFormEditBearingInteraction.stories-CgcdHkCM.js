import{j as o}from"./util-Bw02gGHb.js";/* empty css              */import"./GridUpdatingContextProvider-Duqjn_xW.js";import"./stateDeferredHook-DLHxM2Up.js";import{C as d,B as l}from"./GridWrapper-CbDPn0wg.js";import{r as c}from"./iframe-h4MqiH0z.js";import{b as m}from"./Grid-P3HtWBHg.js";import{c as u}from"./GridPopoverEditBearing-DduIhpkB.js";import"./ActionButton-QdnM2Y72.js";import"./index-Dn-ukQb7.js";import"./preload-helper-Ct5FWWRu.js";const{expect:e,fn:p,userEvent:n,within:v}=__STORYBOOK_MODULE_TEST__,I={title:"GridForm / Interactions",component:d,args:{}},t=p(),B=s=>{const a=c.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(m.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(l.Provider,{value:{anchorRef:a,colId:"",value:null,updateValue:t,formatValue:r=>r,setSaving:()=>{},saving:!1,selectedRows:[],data:{value:""},field:"value"},children:o.jsx(d,{...s,...u})})]})})},i=B.bind({});i.play=async({canvasElement:s})=>{const a=v(s);e(await a.findByText("Press enter or tab to save")).toBeInTheDocument();const r=a.getByPlaceholderText("Enter bearing");e(await a.findByText("–")).toBeInTheDocument(),e(r).toBeInTheDocument(),await n.type(r,"1.2345"),e(await a.findByText(`1° 23' 45"`)).toBeInTheDocument(),t.mockClear(),await n.type(r,"{Enter}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(r,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await n.type(r,"xxx"),e(await a.findByText("?")).toBeInTheDocument(),e(a.getByText("Bearing must be a number in D.MMSSS format")).toBeInTheDocument(),await n.type(r,"{Enter}"),e(t).not.toHaveBeenCalled(),await n.tab(),e(t).not.toHaveBeenCalled(),await n.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
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
          <GridFormEditBearing {...props} {...GridPopoverEditBearingEditorParams} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...i.parameters?.docs?.source}}};const _=["GridFormEditBearingInteractions_"];export{i as GridFormEditBearingInteractions_,_ as __namedExportsOrder,I as default};
