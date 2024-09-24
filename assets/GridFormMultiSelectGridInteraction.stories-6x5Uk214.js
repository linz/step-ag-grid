import{j as r}from"./jsx-runtime-DEdD30eg.js";/* empty css              */import"./GridUpdatingContextProvider-C0OJ_AZp.js";import"./stateDeferredHook-DIITot2w.js";import{f as v,w as h,e,u as t,a as w}from"./index-8uelxQvJ.js";import{m as b}from"./GridWrapper-y58xtKL0.js";import{r as C}from"./index-RYns6xqu.js";import{b as G}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import"./util-CWqzvxZb.js";import{G as p}from"./GridFormMultiSelectGrid-aalq4b8Y.js";import"./ActionButton-BnaFCZwL.js";const H={title:"GridForm / Interactions",component:p,args:{}},a=v((o,l)=>o([])),n=v(async()=>!0),x=v();let m=[];const g=o=>{m=[{label:"Zero",value:0},{label:"One",value:1},{label:"Two",value:2},{label:"Three",value:3},{label:"Four",value:4},{label:r.jsx("div",{children:"Five"}),value:5}];const l={onSave:n,options:m,maxRowCount:3},d=C.useRef(null);return r.jsx("div",{className:"react-menu-inline-test",children:r.jsxs(G.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[r.jsx("h6",{ref:d,children:"Interaction test"}),r.jsx(b.Provider,{value:{anchorRef:d,updateValue:a,colId:"",value:"",selectedRows:[],formatValue:s=>s,setSaving:()=>{},saving:!1,data:{value:""},field:"value"},children:r.jsx(p,{...o,...l})})]})})},i=g.bind({});i.play=async({canvasElement:o})=>{a.mockClear(),n.mockClear(),x.mockClear();const l=h(o),s=await(u=>l.findByRole("menuitem",{name:u}))(/Zero/);e(s).toBeInTheDocument(),await t.click(s),await t.keyboard("{Tab}"),e(a).toHaveBeenCalled(),await w(()=>e(n).toHaveBeenCalledWith({selectedRows:[],addValues:[0],removeValues:[]}));const c=u=>{const f=o.ownerDocument.activeElement;e(f?.innerText).toBe(u)};await t.keyboard("{ArrowRight}"),c("Three"),await t.keyboard("{ArrowRight}"),c("Zero"),await t.keyboard("{ArrowLeft}"),c("Three"),await t.keyboard("{ArrowLeft}"),c("Zero"),a.mockClear(),n.mockClear(),await t.tab(),e(a).toHaveBeenCalledWith(e.anything(),1),e(n).toHaveBeenCalledWith({selectedRows:[],addValues:[0],removeValues:[]}),a.mockClear(),n.mockClear(),await t.tab({shift:!0}),e(a).toHaveBeenCalledWith(e.anything(),-1),e(n).toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormMultiSelectGridProps<any>) => {
  options = [{
    label: "Zero",
    value: 0
  }, {
    label: "One",
    value: 1
  }, {
    label: "Two",
    value: 2
  }, {
    label: "Three",
    value: 3
  }, {
    label: "Four",
    value: 4
  }, {
    label: <div>Five</div>,
    value: 5
  }];
  const config: GridFormMultiSelectGridProps<any> = {
    onSave,
    options,
    maxRowCount: 3
  };
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={"react-menu-inline-test"}>
      <GridContext.Provider value={{
      stopEditing: () => {},
      cancelEdit: () => {}
    } as any}>
        <h6 ref={anchorRef}>Interaction test</h6>
        <GridPopoverContext.Provider value={{
        anchorRef: anchorRef,
        updateValue,
        colId: "",
        value: "",
        selectedRows: [],
        formatValue: value => value,
        setSaving: () => {},
        saving: false,
        data: {
          value: ""
        },
        field: "value"
      }}>
          <GridFormMultiSelectGrid {...props} {...config} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...i.parameters?.docs?.source}}};const V=["GridFormMultiSelectGridInteractions_"];export{i as GridFormMultiSelectGridInteractions_,V as __namedExportsOrder,H as default};
