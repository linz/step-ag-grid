import{j as o}from"./jsx-runtime-DEdD30eg.js";/* empty css              */import"./GridUpdatingContextProvider-CLl46RM8.js";import"./stateDeferredHook-DIITot2w.js";import{f as l,w as c,e,u as n}from"./index-8uelxQvJ.js";import{m}from"./GridWrapper-DSHsENPw.js";import{r as u}from"./index-RYns6xqu.js";import{b as p}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import"./util-CWqzvxZb.js";import{b as d,d as v}from"./GridPopoverEditBearing-DHADJG8v.js";import"./ActionButton-BnaFCZwL.js";const b={title:"GridForm / Interactions",component:d,args:{}},t=l(),f=s=>{const a=u.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(p.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(m.Provider,{value:{anchorRef:a,colId:"",value:null,updateValue:t,formatValue:r=>r,setSaving:()=>{},saving:!1,selectedRows:[],data:{value:""},field:"value"},children:o.jsx(d,{...s,...v})})]})})},i=f.bind({});i.play=async({canvasElement:s})=>{const a=c(s);e(await a.findByText("Press enter or tab to save")).toBeInTheDocument();const r=a.getByPlaceholderText("Enter bearing");e(await a.findByText("–")).toBeInTheDocument(),e(r).toBeInTheDocument(),await n.type(r,"1.2345"),e(await a.findByText(`1° 23' 45"`)).toBeInTheDocument(),t.mockClear(),await n.type(r,"{Enter}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(r,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await n.type(r,"xxx"),e(await a.findByText("?")).toBeInTheDocument(),e(a.getByText("Bearing must be a number in D.MMSSS format")).toBeInTheDocument(),await n.type(r,"{Enter}"),e(t).not.toHaveBeenCalled(),await n.tab(),e(t).not.toHaveBeenCalled(),await n.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormEditBearingProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={"react-menu-inline-test"}>
      <GridContext.Provider value={{
      stopEditing: () => {},
      cancelEdit: () => {}
    } as any}>
        <h6 ref={anchorRef}>Interaction Test</h6>
        <GridPopoverContext.Provider value={{
        anchorRef,
        colId: "",
        value: null,
        updateValue,
        formatValue: value => value,
        setSaving: () => {},
        saving: false,
        selectedRows: [],
        data: {
          value: ""
        },
        field: "value"
      }}>
          <GridFormEditBearing {...props} {...GridPopoverEditBearingEditorParams} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...i.parameters?.docs?.source}}};const H=["GridFormEditBearingInteractions_"];export{i as GridFormEditBearingInteractions_,H as __namedExportsOrder,b as default};
