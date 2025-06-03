import{j as o}from"./index-uvRZkhe0.js";/* empty css              */import"./GridUpdatingContextProvider-TUzqEau3.js";import"./stateDeferredHook-Dh_hbzWK.js";import{f as d,w as c,e,u as r}from"./index-BFcdsecu.js";import{h as l,q as u}from"./GridWrapper-nASS91gz.js";import{r as m}from"./index-DQDNmYQF.js";import{b as p}from"./Grid-Gw6JH53N.js";import"./util-FCHWxW_t.js";import"./ActionButton-C0tjKgIQ.js";import"./index-DYVtDik4.js";const I={title:"GridForm / Interactions",component:l,args:{}},t=d(),v=s=>{const a=m.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(p.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(u.Provider,{value:{anchorRef:a,value:null,updateValue:t,data:{value:null},colId:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:n=>n},children:o.jsx(l,{...s,required:!0})})]})})},i=v.bind({});i.play=async({canvasElement:s})=>{const a=c(s);e(await a.findByText("Must not be empty")).toBeInTheDocument();const n=a.getByPlaceholderText("Type here");await r.type(n,"Hello"),e(await a.findByText("Press tab to save")).toBeInTheDocument(),t.mockClear(),await r.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await r.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await r.type(n,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await r.clear(n),e(a.getByText("Must not be empty")).toBeInTheDocument(),await r.tab(),e(t).not.toHaveBeenCalled(),await r.tab({shift:!0}),e(t).not.toHaveBeenCalled()};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridFormTextAreaProps<any>) => {
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
}`,...i.parameters?.docs?.source}}};const E=["GridFormTextAreaInteractions_"];export{i as GridFormTextAreaInteractions_,E as __namedExportsOrder,I as default};
