import{j as r}from"./util-Bgyi09Ip.js";/* empty css              */import"./GridUpdatingContextProvider-Cm1Mh2ke.js";import"./stateDeferredHook-D_TYtWjH.js";import{l as m,B as b,f as h}from"./GridWrapper-BpIAkRfq.js";import{r as T}from"./iframe-DxqxLvC4.js";import{b as D}from"./Grid-VK9dZD2m.js";import"./ActionButton-BukOjtns.js";import"./index-CG3c8ksy.js";import"./preload-helper-Ct5FWWRu.js";const{expect:e,fn:p,userEvent:o,within:B}=__STORYBOOK_MODULE_TEST__,H={title:"GridForm / Interactions",component:m,args:{}},n=p(async(i,t)=>i([])),c=p(async()=>{}),w=i=>{const t={filtered:"local",onSelectedItem:c,options:[{label:"Enabled",value:1},{label:"Disabled",value:0,disabled:!0},{label:"Sub menu",value:0,subComponent:()=>r.jsx(h,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})}]},a=T.useRef(null);return r.jsx("div",{className:"react-menu-inline-test",children:r.jsxs(D.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[r.jsx("h6",{ref:a,children:"Interaction test"}),r.jsx(b.Provider,{value:{anchorRef:a,updateValue:n,data:{value:""},colId:"",value:"",field:"value",selectedRows:[],formatValue:()=>"",saving:!1,setSaving:()=>{}},children:r.jsx(m,{...i,...t})})]})})},s=w.bind({});s.play=async({canvasElement:i})=>{const t=B(i),a=f=>t.findByRole("menuitem",{name:f}),d=await a("Enabled");e(d).toBeInTheDocument(),await o.click(d),e(n).toHaveBeenCalled(),e(c).toHaveBeenCalled(),n.mockClear(),c.mockClear();const v=await a("Disabled");await o.click(v),e(n).not.toHaveBeenCalled(),e(c).not.toHaveBeenCalled();const u=await a("Sub menu...");e(u).toBeInTheDocument(),e(t.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await o.click(u);const l=await t.findByPlaceholderText("Text input");e(l).toBeInTheDocument(),e(await t.findByText("Must not be empty")).toBeInTheDocument(),await o.type(l,"Hello"),e(await t.findByText("Press enter or tab to save")).toBeInTheDocument(),n.mockClear(),await o.tab(),e(n).toHaveBeenCalledWith(e.anything(),1),n.mockClear(),await o.tab({shift:!0}),e(n).toHaveBeenCalledWith(e.anything(),-1),n.mockClear(),await o.type(l,"{Escape}"),e(n).not.toHaveBeenCalled(),n.mockClear(),await o.clear(l),await o.type(l,"{Enter}"),e(n).not.toHaveBeenCalled();const x=await t.findByPlaceholderText("Filter...");await o.type(x,"ena"),e(t.queryByText("Enabled")).toBeInTheDocument(),e(t.queryByText("Disabled")).not.toBeInTheDocument(),e(t.queryByText("Sub menu...")).not.toBeInTheDocument()};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridFormDropDownProps<any>) => {
  const config: GridFormDropDownProps<any> = {
    filtered: 'local',
    onSelectedItem,
    options: [{
      label: 'Enabled',
      value: 1
    }, {
      label: 'Disabled',
      value: 0,
      disabled: true
    }, {
      label: 'Sub menu',
      value: 0,
      subComponent: () => <GridFormSubComponentTextInput placeholder={'Text input'} maxLength={5} required defaultValue={''} />
    }]
  };
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={'react-menu-inline-test'}>
      <GridContext.Provider value={{
      stopEditing: () => {},
      cancelEdit: () => {}
    } as any}>
        <h6 ref={anchorRef}>Interaction test</h6>
        <GridPopoverContext.Provider value={{
        anchorRef,
        updateValue,
        data: {
          value: ''
        },
        colId: '',
        value: '',
        field: 'value',
        selectedRows: [],
        formatValue: () => '',
        saving: false,
        setSaving: () => {}
      }}>
          <GridFormDropDown {...props} {...config} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...s.parameters?.docs?.source}}};const R=["GridFormDropDownInteractions_"];export{s as GridFormDropDownInteractions_,R as __namedExportsOrder,H as default};
