import{j as r}from"./index-uvRZkhe0.js";/* empty css              */import"./GridUpdatingContextProvider-TUzqEau3.js";import"./stateDeferredHook-Dh_hbzWK.js";import{f as v,w as h,e,u as t,a as w}from"./index-BFcdsecu.js";import{s as p,q as b}from"./GridWrapper-nASS91gz.js";import{r as C}from"./index-DQDNmYQF.js";import{b as x}from"./Grid-Gw6JH53N.js";import"./util-FCHWxW_t.js";import"./ActionButton-C0tjKgIQ.js";import"./index-DYVtDik4.js";const H={title:"GridForm / Interactions",component:p,args:{}},a=v((o,i)=>o([])),n=v(async()=>!0),G=v(),g=r.jsx("div",{children:"Five"});let m=[];const R=o=>{m=[{label:"Zero",value:0},{label:"One",value:1},{label:"Two",value:2},{label:"Three",value:3},{label:"Four",value:4},{label:g,value:5}];const i={onSave:n,options:m,maxRowCount:3},d=C.useRef(null);return r.jsx("div",{className:"react-menu-inline-test",children:r.jsxs(x.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[r.jsx("h6",{ref:d,children:"Interaction test"}),r.jsx(b.Provider,{value:{anchorRef:d,updateValue:a,colId:"",value:"",selectedRows:[],formatValue:s=>s,setSaving:()=>{},saving:!1,data:{value:""},field:"value"},children:r.jsx(p,{...o,...i})})]})})},l=R.bind({});l.play=async({canvasElement:o})=>{a.mockClear(),n.mockClear(),G.mockClear();const i=h(o),s=await(u=>i.findByRole("menuitem",{name:u}))(/Zero/);e(s).toBeInTheDocument(),await t.click(s),await t.keyboard("{Tab}"),e(a).toHaveBeenCalled(),await w(()=>e(n).toHaveBeenCalledWith({selectedRows:[],addValues:[0],removeValues:[]}));const c=u=>{const f=o.ownerDocument.activeElement;e(f?.innerText).toBe(u)};await t.keyboard("{ArrowRight}"),c("Three"),await t.keyboard("{ArrowRight}"),c("Zero"),await t.keyboard("{ArrowLeft}"),c("Three"),await t.keyboard("{ArrowLeft}"),c("Zero"),a.mockClear(),n.mockClear(),await t.tab(),e(a).toHaveBeenCalledWith(e.anything(),1),e(n).toHaveBeenCalledWith({selectedRows:[],addValues:[0],removeValues:[]}),a.mockClear(),n.mockClear(),await t.tab({shift:!0}),e(a).toHaveBeenCalledWith(e.anything(),-1),e(n).toHaveBeenCalled()};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`(props: GridFormMultiSelectGridProps<any>) => {
  options = [{
    label: 'Zero',
    value: 0
  }, {
    label: 'One',
    value: 1
  }, {
    label: 'Two',
    value: 2
  }, {
    label: 'Three',
    value: 3
  }, {
    label: 'Four',
    value: 4
  }, {
    label: five,
    value: 5
  }];
  const config: GridFormMultiSelectGridProps<any> = {
    onSave,
    options,
    maxRowCount: 3
  };
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={'react-menu-inline-test'}>
      <GridContext.Provider value={{
      stopEditing: () => {},
      cancelEdit: () => {}
    } as any}>
        <h6 ref={anchorRef}>Interaction test</h6>
        <GridPopoverContext.Provider value={{
        anchorRef: anchorRef,
        updateValue,
        colId: '',
        value: '',
        selectedRows: [],
        formatValue: value => value,
        setSaving: () => {},
        saving: false,
        data: {
          value: ''
        },
        field: 'value'
      }}>
          <GridFormMultiSelectGrid {...props} {...config} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...l.parameters?.docs?.source}}};const V=["GridFormMultiSelectGridInteractions_"];export{l as GridFormMultiSelectGridInteractions_,V as __namedExportsOrder,H as default};
