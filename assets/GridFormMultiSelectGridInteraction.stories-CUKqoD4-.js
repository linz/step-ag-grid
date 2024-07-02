import{j as r}from"./jsx-runtime-QvZ8i92b.js";/* empty css              */import"./GridUpdatingContextProvider-B57ju6NF.js";import"./stateDeferredHook-3pr3Jmby.js";import{f as m,w as h,e,u as t,a as w}from"./index-BsSOpHTy.js";import{m as b}from"./GridWrapper-DJOqlb4b.js";import{r as C}from"./index-uubelm5h.js";import{b as G}from"./Grid-CzMsKtE0.js";import"./index-CMOtJUyO.js";import"./util-BMTC4KOK.js";import{G as p}from"./GridFormMultiSelectGrid-BS3J_SeL.js";import"./ActionButton-CKl6PlbN.js";import"./index-U6Do-Xt6.js";const I={title:"GridForm / Interactions",component:p,args:{}},a=m((o,l)=>o([])),n=m(async()=>!0),x=m();let v=[];const g=o=>{v=[{label:"Zero",value:0},{label:"One",value:1},{label:"Two",value:2},{label:"Three",value:3},{label:"Four",value:4},{label:r.jsx("div",{children:"Five"}),value:5}];const l={onSave:n,options:v,maxRowCount:3},d=C.useRef(null);return r.jsx("div",{className:"react-menu-inline-test",children:r.jsxs(G.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[r.jsx("h6",{ref:d,children:"Interaction test"}),r.jsx(b.Provider,{value:{anchorRef:d,updateValue:a,value:"",selectedRows:[],formatValue:s=>s,setSaving:()=>{},saving:!1,data:{value:""},field:"value"},children:r.jsx(p,{...o,...l})})]})})},i=g.bind({});i.play=async({canvasElement:o})=>{a.mockClear(),n.mockClear(),x.mockClear();const l=h(o),s=await(u=>l.findByRole("menuitem",{name:u}))(/Zero/);e(s).toBeInTheDocument(),await t.click(s),await t.keyboard("{Tab}"),e(a).toHaveBeenCalled(),await w(()=>e(n).toHaveBeenCalledWith({selectedRows:[],addValues:[0],removeValues:[]}));const c=u=>{const f=o.ownerDocument.activeElement;e(f?.innerText).toBe(u)};await t.keyboard("{ArrowRight}"),c("Three"),await t.keyboard("{ArrowRight}"),c("Zero"),await t.keyboard("{ArrowLeft}"),c("Three"),await t.keyboard("{ArrowLeft}"),c("Zero"),a.mockClear(),n.mockClear(),await t.tab(),e(a).toHaveBeenCalledWith(e.anything(),1),e(n).toHaveBeenCalledWith({selectedRows:[],addValues:[0],removeValues:[]}),a.mockClear(),n.mockClear(),await t.tab({shift:!0}),e(a).toHaveBeenCalledWith(e.anything(),-1),e(n).toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormMultiSelectGridProps<any>) => {
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
      <GridContext.Provider value={({
      stopEditing: () => {},
      cancelEdit: () => {}
    } as any)}>
        <h6 ref={anchorRef}>Interaction test</h6>
        <GridPopoverContext.Provider value={{
        anchorRef: anchorRef,
        updateValue,
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
}`,...i.parameters?.docs?.source}}};const O=["GridFormMultiSelectGridInteractions_"];export{i as GridFormMultiSelectGridInteractions_,O as __namedExportsOrder,I as default};
