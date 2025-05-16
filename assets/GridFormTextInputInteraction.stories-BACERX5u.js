import{j as o}from"./index-uvRZkhe0.js";/* empty css              */import"./GridUpdatingContextProvider-Bkhryk7M.js";import"./stateDeferredHook-Dh_hbzWK.js";import{f as d,w as c,e,u as n}from"./index-BFcdsecu.js";import{B as l,q as u}from"./GridWrapper-DEY5Go7k.js";import{r as p}from"./index-DQDNmYQF.js";import{b as m}from"./Grid-C5eAYTiR.js";import"./util-CYV73bPB.js";import"./ActionButton-BDYCoy1d.js";import"./index-DYVtDik4.js";const E={title:"GridForm / Interactions",component:l,args:{}},t=d(),v=s=>{const a=p.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(m.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(u.Provider,{value:{anchorRef:a,value:null,updateValue:t,data:{value:null},colId:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:r=>r},children:o.jsx(l,{...s,required:!0})})]})})},i=v.bind({});i.play=async({canvasElement:s})=>{const a=c(s);e(await a.findByText("Must not be empty")).toBeInTheDocument();const r=a.getByPlaceholderText("Type here");await n.type(r,"Hello"),e(a.getByText("Press enter or tab to save")).toBeInTheDocument(),t.mockClear(),await n.type(r,"{Enter}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(r,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await n.clear(r),e(a.getByText("Must not be empty")).toBeInTheDocument(),await n.type(r,"{Enter}"),e(t).not.toHaveBeenCalled(),await n.tab(),e(t).not.toHaveBeenCalled(),await n.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormTextInputProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={'react-menu-inline-test'}>
      <GridContext.Provider value={{
      stopEditing: () => {},
      cancelEdit: () => {}
    } as any}>
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
        formatValue: value => value
      }}>
          <GridFormTextInput {...props} required={true} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...i.parameters?.docs?.source}}};const P=["GridFormTextInputInteractions_"];export{i as GridFormTextInputInteractions_,P as __namedExportsOrder,E as default};
