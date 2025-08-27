import{j as o}from"./util-D0ZPQILD.js";/* empty css              */import"./GridUpdatingContextProvider-Bf3uDJXf.js";import"./stateDeferredHook-CMmLGC-b.js";import{k as l,B as d}from"./GridWrapper-Dkr6AhEe.js";import{r as c}from"./iframe-DFgdmXXt.js";import{b as u}from"./Grid-Cl0RwgNy.js";import"./ActionButton-BhkOzu5T.js";import"./index-CGwqqGm4.js";import"./preload-helper-Ct5FWWRu.js";const{expect:e,fn:m,userEvent:n,within:p}=__STORYBOOK_MODULE_TEST__,E={title:"GridForm / Interactions",component:l,args:{}},t=m(),v=s=>{const a=c.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(u.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(d.Provider,{value:{anchorRef:a,value:null,updateValue:t,data:{value:null},colId:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:r=>r},children:o.jsx(l,{...s,required:!0})})]})})},i=v.bind({});i.play=async({canvasElement:s})=>{const a=p(s);e(await a.findByText("Must not be empty")).toBeInTheDocument();const r=a.getByPlaceholderText("Type here");await n.type(r,"Hello"),e(await a.findByText("Press tab to save")).toBeInTheDocument(),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(r,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await n.clear(r),e(a.getByText("Must not be empty")).toBeInTheDocument(),await n.tab(),e(t).not.toHaveBeenCalled(),await n.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormTextAreaProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={'react-menu-inline-test'}>
      <GridContext.Provider value={{
      stopEditing: () => {},
      cancelEdit: () => {}
    } as any}>
        <h6 ref={anchorRef}>Interaction Test</h6>
        <GridPopoverContext.Provider value={{
        anchorRef,
        value: null,
        updateValue,
        data: {
          value: null
        },
        colId: '',
        field: 'value',
        selectedRows: [],
        saving: false,
        setSaving: () => {},
        formatValue: value => value
      }}>
          <GridFormTextArea {...props} required={true} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...i.parameters?.docs?.source}}};const P=["GridFormTextAreaInteractions_"];export{i as GridFormTextAreaInteractions_,P as __namedExportsOrder,E as default};
