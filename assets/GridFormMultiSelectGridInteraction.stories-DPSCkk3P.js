import{j as r}from"./util-B6pJytQ4.js";/* empty css              */import"./GridUpdatingContextProvider-R8BvGmQD.js";import"./stateDeferredHook-Dvy6TW6N.js";import{v as p,B as h}from"./GridWrapper-C94wn5Fr.js";import{r as w}from"./iframe-BBeBoPQM.js";import{b}from"./Grid-CbECBfpJ.js";import"./ActionButton-oJCgpU9B.js";import"./index-Ci9P-iYA.js";import"./preload-helper-Ct5FWWRu.js";const{expect:e,fn:v,userEvent:t,waitFor:C,within:x}=__STORYBOOK_MODULE_TEST__,O={title:"GridForm / Interactions",component:p,args:{}},n=v((o,i)=>o([])),a=v(async()=>!0),G=v(),g=r.jsx("div",{children:"Five"});let m=[];const R=o=>{m=[{label:"Zero",value:0},{label:"One",value:1},{label:"Two",value:2},{label:"Three",value:3},{label:"Four",value:4},{label:g,value:5}];const i={onSave:a,options:m,maxRowCount:3},d=w.useRef(null);return r.jsx("div",{className:"react-menu-inline-test",children:r.jsxs(b.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[r.jsx("h6",{ref:d,children:"Interaction test"}),r.jsx(h.Provider,{value:{anchorRef:d,updateValue:n,colId:"",value:"",selectedRows:[],formatValue:s=>s,setSaving:()=>{},saving:!1,data:{value:""},field:"value"},children:r.jsx(p,{...o,...i})})]})})},l=R.bind({});l.play=async({canvasElement:o})=>{n.mockClear(),a.mockClear(),G.mockClear();const i=x(o),s=await(u=>i.findByRole("menuitem",{name:u}))(/Zero/);e(s).toBeInTheDocument(),await t.click(s),await t.keyboard("{Tab}"),e(n).toHaveBeenCalled(),await C(()=>e(a).toHaveBeenCalledWith({selectedRows:[],addValues:[0],removeValues:[]}));const c=u=>{const f=o.ownerDocument.activeElement;e(f?.innerText).toBe(u)};await t.keyboard("{ArrowRight}"),c("Three"),await t.keyboard("{ArrowRight}"),c("Zero"),await t.keyboard("{ArrowLeft}"),c("Three"),await t.keyboard("{ArrowLeft}"),c("Zero"),n.mockClear(),a.mockClear(),await t.tab(),e(n).toHaveBeenCalledWith(e.anything(),1),e(a).toHaveBeenCalledWith({selectedRows:[],addValues:[0],removeValues:[]}),n.mockClear(),a.mockClear(),await t.tab({shift:!0}),e(n).toHaveBeenCalledWith(e.anything(),-1),e(a).toHaveBeenCalled()};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`(props: GridFormMultiSelectGridProps<any>) => {
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
}`,...l.parameters?.docs?.source}}};const I=["GridFormMultiSelectGridInteractions_"];export{l as GridFormMultiSelectGridInteractions_,I as __namedExportsOrder,O as default};
