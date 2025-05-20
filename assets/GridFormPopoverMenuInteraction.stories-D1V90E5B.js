import{j as o}from"./index-uvRZkhe0.js";/* empty css              */import"./GridUpdatingContextProvider-Cl4YAuE6.js";import"./stateDeferredHook-Dh_hbzWK.js";import{f as c,w as f,e,u as n}from"./index-BFcdsecu.js";import{A as x,q as B,P as C,f as y,g as w}from"./GridWrapper-DPDU43au.js";import{r as P}from"./index-DQDNmYQF.js";import{b as I}from"./Grid-C5I1boQ6.js";import"./util-CYV73bPB.js";import"./ActionButton-BDYCoy1d.js";import"./index-DYVtDik4.js";const q={title:"GridForm / Interactions",component:x,args:{}},t=c((l,a)=>l([])),s=c().mockResolvedValue(void 0),b=c().mockResolvedValue(void 0),g=l=>{const a=P.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(I.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(B.Provider,{value:{anchorRef:a,value:null,updateValue:t,data:{value:""},colId:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:r=>r},children:o.jsx(x,{...l,options:()=>[{label:"Enabled",value:1,action:s},C,{label:"Disabled",value:0,disabled:!0,action:b},{label:"Sub text input",value:0,subComponent:()=>o.jsx(y,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})},{label:"Sub text area",value:0,subComponent:()=>o.jsx(w,{placeholder:"Text area",maxLength:5,required:!0,defaultValue:""})},{label:"ERROR! this should be hidden",value:3,hidden:!0}]})})]})})},d=g.bind({});d.play=async({canvasElement:l})=>{const a=f(l),r=T=>a.findByRole("menuitem",{name:T}),p=await r("Enabled");e(p).toBeInTheDocument(),await n.click(p),e(s).toHaveBeenCalled(),s.mockClear();const m=await r("Disabled");e(m).toBeInTheDocument(),await n.click(m),e(b).not.toHaveBeenCalled();const v=await r("Sub text input");e(v).toBeInTheDocument(),e(a.queryByPlaceholderText("Text input")).not.toBeInTheDocument();const h=await r("Sub text area");e(h).toBeInTheDocument(),e(a.queryByPlaceholderText("Text area")).not.toBeInTheDocument(),await n.click(v);const i=await a.findByPlaceholderText("Text input");e(i).toBeInTheDocument(),e(await a.findByText("Must not be empty")).toBeInTheDocument(),e(a.queryByPlaceholderText("Text area")).not.toBeInTheDocument(),await n.type(i,"Hello"),e(await a.findByText("Press enter or tab to save")).toBeInTheDocument(),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(i,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await n.clear(i),await n.type(i,"{Enter}"),e(t).not.toHaveBeenCalled(),h.click();const u=await a.findByPlaceholderText("Text area");e(u).toBeInTheDocument(),e(await a.findByText("Must not be empty")).toBeInTheDocument(),e(a.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await n.type(u,"Hello"),e(await a.findByText("Press tab to save")).toBeInTheDocument(),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(u,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await n.clear(u),await n.type(u,"{Enter}"),e(t).not.toHaveBeenCalled()};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`(props: GridFormPopoverMenuProps<any>) => {
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
          value: ''
        },
        colId: '',
        field: 'value',
        selectedRows: [],
        saving: false,
        setSaving: () => {},
        formatValue: value => value
      }}>
          <GridFormPopoverMenu {...props} options={() => [{
          label: 'Enabled',
          value: 1,
          action: enabledAction
        }, PopoutMenuSeparator, {
          label: 'Disabled',
          value: 0,
          disabled: true,
          action: disabledAction
        }, {
          label: 'Sub text input',
          value: 0,
          subComponent: () => <GridFormSubComponentTextInput placeholder={'Text input'} maxLength={5} required defaultValue={''} />
        }, {
          label: 'Sub text area',
          value: 0,
          subComponent: () => <GridFormSubComponentTextArea placeholder={'Text area'} maxLength={5} required defaultValue={''} />
        }, {
          label: 'ERROR! this should be hidden',
          value: 3,
          hidden: true
        }]} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...d.parameters?.docs?.source}}};const A=["GridFormPopoverMenuInteractions_"];export{d as GridFormPopoverMenuInteractions_,A as __namedExportsOrder,q as default};
