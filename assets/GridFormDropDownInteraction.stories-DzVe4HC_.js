import{j as r}from"./index-_eCCCJMN.js";/* empty css              */import"./GridUpdatingContextProvider-DK2uKtWm.js";import"./stateDeferredHook-9sbfsEJK.js";import{f as m,w as b,e,u as a}from"./index-DJy14G1K.js";import{m as p,p as h,f as w}from"./GridWrapper-DVhisWkQ.js";import{r as D}from"./index-ne9I_3bB.js";import{b as y}from"./Grid-BnijaEma.js";import"./util-DX3mDqFH.js";import"./ActionButton-CwNE6oAT.js";import"./index-JPfhvaY4.js";const k={title:"GridForm / Interactions",component:p,args:{}},n=m(async(i,t)=>i([])),c=m(async()=>{}),T=i=>{const t={filtered:"local",onSelectedItem:c,options:[{label:"Enabled",value:1},{label:"Disabled",value:0,disabled:!0},{label:"Sub menu",value:0,subComponent:()=>r.jsx(w,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})}]},o=D.useRef(null);return r.jsx("div",{className:"react-menu-inline-test",children:r.jsxs(y.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[r.jsx("h6",{ref:o,children:"Interaction test"}),r.jsx(h.Provider,{value:{anchorRef:o,updateValue:n,data:{value:""},colId:"",value:"",field:"value",selectedRows:[],formatValue:()=>"",saving:!1,setSaving:()=>{}},children:r.jsx(p,{...i,...t})})]})})},s=T.bind({});s.play=async({canvasElement:i})=>{const t=b(i),o=x=>t.findByRole("menuitem",{name:x}),d=await o("Enabled");e(d).toBeInTheDocument(),await a.click(d),e(n).toHaveBeenCalled(),e(c).toHaveBeenCalled(),n.mockClear(),c.mockClear();const v=await o("Disabled");await a.click(v),e(n).not.toHaveBeenCalled(),e(c).not.toHaveBeenCalled();const u=await o("Sub menu...");e(u).toBeInTheDocument(),e(t.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await a.click(u);const l=await t.findByPlaceholderText("Text input");e(l).toBeInTheDocument(),e(await t.findByText("Must not be empty")).toBeInTheDocument(),await a.type(l,"Hello"),e(await t.findByText("Press enter or tab to save")).toBeInTheDocument(),n.mockClear(),await a.tab(),e(n).toHaveBeenCalledWith(e.anything(),1),n.mockClear(),await a.tab({shift:!0}),e(n).toHaveBeenCalledWith(e.anything(),-1),n.mockClear(),await a.type(l,"{Escape}"),e(n).not.toHaveBeenCalled(),n.mockClear(),await a.clear(l),await a.type(l,"{Enter}"),e(n).not.toHaveBeenCalled();const f=await t.findByPlaceholderText("Filter...");await a.type(f,"ena"),e(t.queryByText("Enabled")).toBeInTheDocument(),e(t.queryByText("Disabled")).not.toBeInTheDocument(),e(t.queryByText("Sub menu...")).not.toBeInTheDocument()};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridFormDropDownProps<any>) => {
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
}`,...s.parameters?.docs?.source}}};const j=["GridFormDropDownInteractions_"];export{s as GridFormDropDownInteractions_,j as __namedExportsOrder,k as default};
