import{j as o}from"./jsx-runtime-DEdD30eg.js";/* empty css              */import"./GridUpdatingContextProvider-C0OJ_AZp.js";import"./stateDeferredHook-DIITot2w.js";import{f as d,w as c,e,u as r}from"./index-8uelxQvJ.js";import{m}from"./GridWrapper-y58xtKL0.js";import{r as u}from"./index-RYns6xqu.js";import{b as p}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import"./util-CWqzvxZb.js";import{G as l}from"./GridFormTextArea-teTdy3sf.js";import"./ActionButton-BnaFCZwL.js";const E={title:"GridForm / Interactions",component:l,args:{}},t=d(),v=s=>{const a=u.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(p.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(m.Provider,{value:{anchorRef:a,value:null,updateValue:t,data:{value:null},colId:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:n=>n},children:o.jsx(l,{...s,required:!0})})]})})},i=v.bind({});i.play=async({canvasElement:s})=>{const a=c(s);e(await a.findByText("Must not be empty")).toBeInTheDocument();const n=a.getByPlaceholderText("Type here");await r.type(n,"Hello"),e(await a.findByText("Press tab to save")).toBeInTheDocument(),t.mockClear(),await r.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await r.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await r.type(n,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await r.clear(n),e(a.getByText("Must not be empty")).toBeInTheDocument(),await r.tab(),e(t).not.toHaveBeenCalled(),await r.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormTextAreaProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={"react-menu-inline-test"}>
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
        colId: "",
        field: "value",
        selectedRows: [],
        saving: false,
        setSaving: () => {},
        formatValue: value => value
      }}>
          <GridFormTextArea {...props} required={true} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...i.parameters?.docs?.source}}};const b=["GridFormTextAreaInteractions_"];export{i as GridFormTextAreaInteractions_,b as __namedExportsOrder,E as default};
