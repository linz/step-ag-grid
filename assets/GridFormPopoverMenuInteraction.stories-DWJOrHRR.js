import{j as o}from"./util-B6pJytQ4.js";/* empty css              */import"./GridUpdatingContextProvider-R8BvGmQD.js";import"./stateDeferredHook-Dvy6TW6N.js";import{D as x,B,P as f,f as C,g as y}from"./GridWrapper-C94wn5Fr.js";import{r as w}from"./iframe-BBeBoPQM.js";import{b as P}from"./Grid-CbECBfpJ.js";import"./ActionButton-oJCgpU9B.js";import"./index-Ci9P-iYA.js";import"./preload-helper-Ct5FWWRu.js";const c=__STORYBOOK_MODULE_TEST__,{expect:e,userEvent:a,within:I}=__STORYBOOK_MODULE_TEST__,F={title:"GridForm / Interactions",component:x,args:{}},t=c.fn((l,n)=>l([])),s=c.fn().mockResolvedValue(void 0),b=c.fn().mockResolvedValue(void 0),E=l=>{const n=w.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(P.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:n,children:"Interaction Test"}),o.jsx(B.Provider,{value:{anchorRef:n,value:null,updateValue:t,data:{value:""},colId:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:r=>r},children:o.jsx(x,{...l,options:()=>[{label:"Enabled",value:1,action:s},f,{label:"Disabled",value:0,disabled:!0,action:b},{label:"Sub text input",value:0,subComponent:()=>o.jsx(C,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})},{label:"Sub text area",value:0,subComponent:()=>o.jsx(y,{placeholder:"Text area",maxLength:5,required:!0,defaultValue:""})},{label:"ERROR! this should be hidden",value:3,hidden:!0}]})})]})})},d=E.bind({});d.play=async({canvasElement:l})=>{const n=I(l),r=T=>n.findByRole("menuitem",{name:T}),p=await r("Enabled");e(p).toBeInTheDocument(),await a.click(p),e(s).toHaveBeenCalled(),s.mockClear();const m=await r("Disabled");e(m).toBeInTheDocument(),await a.click(m),e(b).not.toHaveBeenCalled();const v=await r("Sub text input");e(v).toBeInTheDocument(),e(n.queryByPlaceholderText("Text input")).not.toBeInTheDocument();const h=await r("Sub text area");e(h).toBeInTheDocument(),e(n.queryByPlaceholderText("Text area")).not.toBeInTheDocument(),await a.click(v);const i=await n.findByPlaceholderText("Text input");e(i).toBeInTheDocument(),e(await n.findByText("Must not be empty")).toBeInTheDocument(),e(n.queryByPlaceholderText("Text area")).not.toBeInTheDocument(),await a.type(i,"Hello"),e(await n.findByText("Press enter or tab to save")).toBeInTheDocument(),t.mockClear(),await a.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await a.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await a.type(i,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await a.clear(i),await a.type(i,"{Enter}"),e(t).not.toHaveBeenCalled(),h.click();const u=await n.findByPlaceholderText("Text area");e(u).toBeInTheDocument(),e(await n.findByText("Must not be empty")).toBeInTheDocument(),e(n.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await a.type(u,"Hello"),e(await n.findByText("Press tab to save")).toBeInTheDocument(),t.mockClear(),await a.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await a.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await a.type(u,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await a.clear(u),await a.type(u,"{Enter}"),e(t).not.toHaveBeenCalled()};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`(props: GridFormPopoverMenuProps<any>) => {
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
}`,...d.parameters?.docs?.source}}};const V=["GridFormPopoverMenuInteractions_"];export{d as GridFormPopoverMenuInteractions_,V as __namedExportsOrder,F as default};
