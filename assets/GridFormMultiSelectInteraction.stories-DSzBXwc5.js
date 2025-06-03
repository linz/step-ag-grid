import{j as l}from"./index-uvRZkhe0.js";/* empty css              */import"./GridUpdatingContextProvider-TUzqEau3.js";import"./stateDeferredHook-Dh_hbzWK.js";import{f as v,w as y,e,u as n}from"./index-BFcdsecu.js";import{z as x,q as T,f as B}from"./GridWrapper-nASS91gz.js";import{r as C}from"./index-DQDNmYQF.js";import{b}from"./Grid-Gw6JH53N.js";import{w}from"./util-FCHWxW_t.js";import"./ActionButton-C0tjKgIQ.js";import"./index-DYVtDik4.js";const R={title:"GridForm / Interactions",component:x,args:{}},o=v((i,t)=>i([])),a=v(),p=v();let r=[];const I=i=>{r=[{label:"Zero",value:0},{label:"One",value:1},{label:"Sub component",value:2,subComponent:()=>l.jsx(B,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})},{label:"Other",value:3}];const t={filtered:!0,onSelectFilter:p,filterHelpText:"Press enter to add free-text",onSave:a,options:r},c=C.useRef(null);return l.jsx("div",{className:"react-menu-inline-test",children:l.jsxs(b.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[l.jsx("h6",{ref:c,children:"Interaction test"}),l.jsx(T.Provider,{value:{anchorRef:c,updateValue:o,data:{value:""},colId:"",value:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:d=>d},children:l.jsx(x,{...i,...t})})]})})},u=I.bind({});u.play=async({canvasElement:i})=>{o.mockClear(),a.mockClear(),p.mockClear();const t=y(i),c=f=>t.findByRole("menuitem",{name:f}),d=await c(/Zero/);e(d).toBeInTheDocument(),await n.click(d),await n.keyboard("{Tab}"),e(o).toHaveBeenCalled(),e(a).toHaveBeenCalledWith({selectedOptions:[r[0]],selectedRows:[]});const h=await c(/Sub component/);e(h).toBeInTheDocument(),e(t.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await n.click(h);const s=await t.findByPlaceholderText("Text input");e(s).toBeInTheDocument(),e(await t.findByText("Must not be empty")).toBeInTheDocument(),await n.type(s,"Hello"),e(await t.findByText("Press enter or tab to save")).toBeInTheDocument(),o.mockClear(),a.mockClear(),await n.tab(),e(o).toHaveBeenCalledWith(e.anything(),1),e(a).toHaveBeenCalledWith({selectedRows:[],selectedOptions:[{label:"Zero",value:0,checked:!0},{label:"Sub component",value:2,checked:!0,subValue:"Hello",subComponent:e.anything()}]}),o.mockClear(),a.mockClear(),await n.tab({shift:!0}),e(o).toHaveBeenCalledWith(e.anything(),-1),e(a).toHaveBeenCalled(),o.mockClear(),a.mockClear(),await n.type(s,"{Escape}"),e(o).not.toHaveBeenCalled(),e(a).not.toHaveBeenCalled(),o.mockClear(),a.mockClear(),await n.clear(s),await n.type(s,"{Enter}"),e(o).not.toHaveBeenCalled(),e(a).not.toHaveBeenCalled();const m=await t.findByPlaceholderText("Filter...");await n.type(m,"o"),await w(500),e(t.queryByText("One")).toBeInTheDocument(),e(t.queryByText("Other")).toBeInTheDocument(),await n.type(m,"n"),e(t.queryByText("One")).toBeInTheDocument(),e(t.queryByText("Zero")).not.toBeInTheDocument(),e(t.queryByText("Sub component")).not.toBeInTheDocument(),e(t.queryByText("Other")).not.toBeInTheDocument(),await n.type(m,"x"),e(t.queryByText("One")).not.toBeInTheDocument(),e(t.queryByText("No Options")).toBeInTheDocument(),await n.type(m,"{Enter}"),e(p).toHaveBeenCalledWith({filter:"onx",options:[{...r[0],checked:!0},{...r[1]},{...r[2],checked:!0},{...r[3]}]})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`(props: GridFormMultiSelectProps<any>) => {
  options = [{
    label: 'Zero',
    value: 0
  }, {
    label: 'One',
    value: 1
  }, {
    label: 'Sub component',
    value: 2,
    subComponent: () => <GridFormSubComponentTextInput placeholder={'Text input'} maxLength={5} required defaultValue={''} />
  }, {
    label: 'Other',
    value: 3
  }];
  const config: GridFormMultiSelectProps<any> = {
    filtered: true,
    onSelectFilter,
    filterHelpText: 'Press enter to add free-text',
    onSave,
    options
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
        saving: false,
        setSaving: () => {},
        formatValue: value => value
      }}>
          <GridFormMultiSelect {...props} {...config} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...u.parameters?.docs?.source}}};const M=["GridFormMultiSelectInteractions_"];export{u as GridFormMultiSelectInteractions_,M as __namedExportsOrder,R as default};
