import{j as r}from"./util-CgugAU5W.js";/* empty css              *//* empty css              */import"./stateDeferredHook-DLMcti5_.js";import{l as m,I as f,f as h}from"./GridWrapper-ByjUL_3E.js";import{r as T}from"./iframe-qoNDcQrb.js";import"./Grid-vjV2ljNn.js";import"./client-DIuOxkbO.js";import{a as w}from"./GridUpdatingContextProvider-CR4twmSI.js";import"./ActionButton-CzX0v5O0.js";import"./index-2kSpQblA.js";import"./preload-helper-PPVm8Dsz.js";const{expect:e,fn:p,userEvent:o,within:B}=__STORYBOOK_MODULE_TEST__,k={title:"GridForm / Interactions",component:m,args:{}},n=p(async(i,t)=>i([])),d=p(async()=>{}),D=i=>{const t={filtered:"local",onSelectedItem:d,options:[{label:"Enabled",value:1},{label:"Disabled",value:0,disabled:!0},{label:"Sub menu",value:0,subComponent:()=>r.jsx(h,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})}]},a=T.useRef(null);return r.jsx("div",{className:"react-menu-inline-test",children:r.jsxs(w,{children:[r.jsx("h6",{ref:a,children:"Interaction test"}),r.jsx(f.Provider,{value:{anchorRef:a,updateValue:n,data:{value:""},colId:"",value:"",field:"value",selectedRows:[],formatValue:()=>"",saving:!1,setSaving:()=>{},stopEditing:()=>{}},children:r.jsx(m,{...i,...t})})]})})},s=D.bind({});s.play=async({canvasElement:i})=>{const t=B(i),a=b=>t.findByRole("menuitem",{name:b}),c=await a("Enabled");e(c).toBeInTheDocument(),await o.click(c),e(n).toHaveBeenCalled(),e(d).toHaveBeenCalled(),n.mockClear(),d.mockClear();const v=await a("Disabled");await o.click(v),e(n).not.toHaveBeenCalled(),e(d).not.toHaveBeenCalled();const u=await a("Sub menu...");e(u).toBeInTheDocument(),e(t.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await o.click(u);const l=await t.findByPlaceholderText("Text input");e(l).toBeInTheDocument(),e(await t.findByText("Must not be empty")).toBeInTheDocument(),await o.type(l,"Hello"),e(await t.findByText("Press enter or tab to save")).toBeInTheDocument(),n.mockClear(),await o.tab(),e(n).toHaveBeenCalledWith(e.anything(),1),n.mockClear(),await o.tab({shift:!0}),e(n).toHaveBeenCalledWith(e.anything(),-1),n.mockClear(),await o.type(l,"{Escape}"),e(n).toHaveBeenCalledWith(e.anything(),0),n.mockClear(),await o.clear(l),await o.type(l,"{Enter}"),e(n).not.toHaveBeenCalled();const x=await t.findByPlaceholderText("Filter...");await o.type(x,"ena"),e(t.queryByText("Enabled")).toBeInTheDocument(),e(t.queryByText("Disabled")).not.toBeInTheDocument(),e(t.queryByText("Sub menu...")).not.toBeInTheDocument()};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridFormDropDownProps<GridBaseRow, number>) => {
  const config: GridFormDropDownProps<GridBaseRow, number> = {
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
      <GridContextProvider>
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
        setSaving: () => {},
        stopEditing: () => {}
      }}>
          <GridFormDropDown {...props} {...config} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>;
}`,...s.parameters?.docs?.source}}};const j=["GridFormDropDownInteractions_"];export{s as GridFormDropDownInteractions_,j as __namedExportsOrder,k as default};
