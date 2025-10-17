import{j as l,w as f}from"./util-DLs6oNd5.js";/* empty css              *//* empty css              */import"./stateDeferredHook-XdB2k1Hj.js";import{w as x,D as y,f as B}from"./GridWrapper-AYTIASZI.js";import{r as C}from"./iframe-BP35bxbM.js";import"./Grid-BkkVO4Ox.js";import{a as b}from"./GridUpdatingContextProvider-HjD1Gfdc.js";import"./ActionButton-DVSYuZ1g.js";import"./index-BoYIildN.js";import"./preload-helper-PPVm8Dsz.js";const{expect:e,fn:h,userEvent:n,within:w}=__STORYBOOK_MODULE_TEST__,_={title:"GridForm / Interactions",component:x,args:{}},o=h((i,t)=>i([])),a=h(),p=h();let r=[];const I=i=>{r=[{label:"Zero",value:0},{label:"One",value:1},{label:"Sub component",value:2,subComponent:()=>l.jsx(B,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})},{label:"Other",value:3}];const t={filtered:!0,onSelectFilter:p,filterHelpText:"Press enter to add free-text",onSave:a,options:r},c=C.useRef(null);return l.jsx("div",{className:"react-menu-inline-test",children:l.jsxs(b,{children:[l.jsx("h6",{ref:c,children:"Interaction test"}),l.jsx(y.Provider,{value:{anchorRef:c,updateValue:o,data:{value:""},colId:"",value:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:d=>d,stopEditing:()=>{}},children:l.jsx(x,{...i,...t})})]})})},u=I.bind({});u.play=async({canvasElement:i})=>{o.mockClear(),a.mockClear(),p.mockClear();const t=w(i),c=T=>t.findByRole("menuitem",{name:T}),d=await c(/Zero/);e(d).toBeInTheDocument(),await n.click(d),await n.keyboard("{Tab}"),e(o).toHaveBeenCalled(),e(a).toHaveBeenCalledWith({selectedOptions:[r[0]],selectedRows:[]});const v=await c(/Sub component/);e(v).toBeInTheDocument(),e(t.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await n.click(v);const s=await t.findByPlaceholderText("Text input");e(s).toBeInTheDocument(),e(await t.findByText("Must not be empty")).toBeInTheDocument(),await n.type(s,"Hello"),e(await t.findByText("Press enter or tab to save")).toBeInTheDocument(),o.mockClear(),a.mockClear(),await n.tab(),e(o).toHaveBeenCalledWith(e.anything(),1),e(a).toHaveBeenCalledWith({selectedRows:[],selectedOptions:[{label:"Zero",value:0,checked:!0},{label:"Sub component",value:2,checked:!0,subValue:"Hello",subComponent:e.anything()}]}),o.mockClear(),a.mockClear(),await n.tab({shift:!0}),e(o).toHaveBeenCalledWith(e.anything(),-1),e(a).toHaveBeenCalled(),o.mockClear(),a.mockClear(),await n.type(s,"{Escape}"),e(o).toHaveBeenCalledWith(e.anything(),0),e(a).not.toHaveBeenCalled(),o.mockClear(),a.mockClear(),await n.clear(s),await n.type(s,"{Enter}"),e(o).not.toHaveBeenCalled(),e(a).not.toHaveBeenCalled();const m=await t.findByPlaceholderText("Filter...");await n.type(m,"o"),await f(500),e(t.queryByText("One")).toBeInTheDocument(),e(t.queryByText("Other")).toBeInTheDocument(),await n.type(m,"n"),e(t.queryByText("One")).toBeInTheDocument(),e(t.queryByText("Zero")).not.toBeInTheDocument(),e(t.queryByText("Sub component")).not.toBeInTheDocument(),e(t.queryByText("Other")).not.toBeInTheDocument(),await n.type(m,"x"),e(t.queryByText("One")).not.toBeInTheDocument(),e(t.queryByText("No Options")).toBeInTheDocument(),await n.type(m,"{Enter}"),e(p).toHaveBeenCalledWith({filter:"onx",options:[{...r[0],checked:!0},{...r[1]},{...r[2],checked:!0},{...r[3]}]})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`(props: GridFormMultiSelectProps<any>) => {
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
        saving: false,
        setSaving: () => {},
        formatValue: value => value,
        stopEditing: () => {}
      }}>
          <GridFormMultiSelect {...props} {...config} />
        </GridPopoverContext.Provider>
      </GridContextProvider>
    </div>;
}`,...u.parameters?.docs?.source}}};const q=["GridFormMultiSelectInteractions_"];export{u as GridFormMultiSelectInteractions_,q as __namedExportsOrder,_ as default};
