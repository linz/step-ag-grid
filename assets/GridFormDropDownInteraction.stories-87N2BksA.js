import{j as r}from"./util-B6pJytQ4.js";/* empty css              */import"./GridUpdatingContextProvider-R8BvGmQD.js";import"./stateDeferredHook-Dvy6TW6N.js";import{l as m,B as f,f as h}from"./GridWrapper-C94wn5Fr.js";import{r as B}from"./iframe-BBeBoPQM.js";import{b as T}from"./Grid-CbECBfpJ.js";import"./ActionButton-oJCgpU9B.js";import"./index-Ci9P-iYA.js";import"./preload-helper-Ct5FWWRu.js";const{expect:e,fn:p,userEvent:o,within:w}=__STORYBOOK_MODULE_TEST__,F={title:"GridForm / Interactions",component:m,args:{}},n=p(async(i,t)=>i([])),d=p(async()=>{}),D=i=>{const t={filtered:"local",onSelectedItem:d,options:[{label:"Enabled",value:1},{label:"Disabled",value:0,disabled:!0},{label:"Sub menu",value:0,subComponent:()=>r.jsx(h,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})}]},a=B.useRef(null);return r.jsx("div",{className:"react-menu-inline-test",children:r.jsxs(T.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[r.jsx("h6",{ref:a,children:"Interaction test"}),r.jsx(f.Provider,{value:{anchorRef:a,updateValue:n,data:{value:""},colId:"",value:"",field:"value",selectedRows:[],formatValue:()=>"",saving:!1,setSaving:()=>{}},children:r.jsx(m,{...i,...t})})]})})},s=D.bind({});s.play=async({canvasElement:i})=>{const t=w(i),a=b=>t.findByRole("menuitem",{name:b}),c=await a("Enabled");e(c).toBeInTheDocument(),await o.click(c),e(n).toHaveBeenCalled(),e(d).toHaveBeenCalled(),n.mockClear(),d.mockClear();const v=await a("Disabled");await o.click(v),e(n).not.toHaveBeenCalled(),e(d).not.toHaveBeenCalled();const u=await a("Sub menu...");e(u).toBeInTheDocument(),e(t.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await o.click(u);const l=await t.findByPlaceholderText("Text input");e(l).toBeInTheDocument(),e(await t.findByText("Must not be empty")).toBeInTheDocument(),await o.type(l,"Hello"),e(await t.findByText("Press enter or tab to save")).toBeInTheDocument(),n.mockClear(),await o.tab(),e(n).toHaveBeenCalledWith(e.anything(),1),n.mockClear(),await o.tab({shift:!0}),e(n).toHaveBeenCalledWith(e.anything(),-1),n.mockClear(),await o.type(l,"{Escape}"),e(n).not.toHaveBeenCalled(),n.mockClear(),await o.clear(l),await o.type(l,"{Enter}"),e(n).not.toHaveBeenCalled();const x=await t.findByPlaceholderText("Filter...");await o.type(x,"ena"),e(t.queryByText("Enabled")).toBeInTheDocument(),e(t.queryByText("Disabled")).not.toBeInTheDocument(),e(t.queryByText("Sub menu...")).not.toBeInTheDocument()};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridFormDropDownProps<GridBaseRow, number>) => {
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
}`,...s.parameters?.docs?.source}}};const H=["GridFormDropDownInteractions_"];export{s as GridFormDropDownInteractions_,H as __namedExportsOrder,F as default};
