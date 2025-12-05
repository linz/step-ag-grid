import{j as r}from"./util-Do7DUC2X.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{u as p,I as h}from"./GridWrapper-BAUk9ZaG.js";import{r as w}from"./iframe-fuNulc0f.js";import"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{a as b}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const{expect:e,fn:v,userEvent:t,waitFor:C,within:x}=__STORYBOOK_MODULE_TEST__,j={title:"GridForm / Interactions",component:p,args:{}},n=v((a,l)=>a([])),o=v(async()=>!0),G=v(),g=r.jsx("div",{children:"Five"});let m=[];const R=a=>{m=[{label:"Zero",value:0},{label:"One",value:1},{label:"Two",value:2},{label:"Three",value:3},{label:"Four",value:4},{label:g,value:5}];const l={onSave:o,options:m,maxRowCount:3},d=w.useRef(null);return r.jsx("div",{className:"react-menu-inline-test",children:r.jsxs(b,{children:[r.jsx("h6",{ref:d,children:"Interaction test"}),r.jsx(h.Provider,{value:{anchorRef:d,updateValue:n,colId:"",value:"",selectedRows:[],formatValue:s=>s,setSaving:()=>{},saving:!1,data:{value:""},field:"value",stopEditing:()=>{}},children:r.jsx(p,{...a,...l})})]})})},i=R.bind({});i.play=async({canvasElement:a})=>{n.mockClear(),o.mockClear(),G.mockClear();const l=x(a),s=await(u=>l.findByRole("menuitem",{name:u}))(/Zero/);e(s).toBeInTheDocument(),await t.click(s),await t.keyboard("{Tab}"),e(n).toHaveBeenCalled(),await C(()=>e(o).toHaveBeenCalledWith({selectedRows:[],addValues:[0],removeValues:[]}));const c=u=>{const f=a.ownerDocument.activeElement;e(f?.innerText).toBe(u)};await t.keyboard("{ArrowRight}"),c("Three"),await t.keyboard("{ArrowRight}"),c("Zero"),await t.keyboard("{ArrowLeft}"),c("Three"),await t.keyboard("{ArrowLeft}"),c("Zero"),n.mockClear(),o.mockClear(),await t.tab(),e(n).toHaveBeenCalledWith(e.anything(),1),e(o).toHaveBeenCalledWith({selectedRows:[],addValues:[0],removeValues:[]}),n.mockClear(),o.mockClear(),await t.tab({shift:!0}),e(n).toHaveBeenCalledWith(e.anything(),-1),e(o).toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormMultiSelectGridProps<any>) => {
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
      <GridContextProvider>
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
        field: 'value',
        stopEditing: () => {}
      }}>
          <GridFormMultiSelectGrid {...props} {...config} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>;
}`,...i.parameters?.docs?.source}}};const H=["GridFormMultiSelectGridInteractions_"];export{i as GridFormMultiSelectGridInteractions_,H as __namedExportsOrder,j as default};
