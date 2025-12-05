import{j as o}from"./util-Do7DUC2X.js";/* empty css              *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{K as x,I as B,P as f,i as C,j as y}from"./GridWrapper-BAUk9ZaG.js";import{r as w}from"./iframe-fuNulc0f.js";import"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{a as I}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const c=__STORYBOOK_MODULE_TEST__,{expect:e,userEvent:a,within:P}=__STORYBOOK_MODULE_TEST__,V={title:"GridForm / Interactions",component:x,args:{}},t=c.fn((i,n)=>i([])),s=c.fn().mockResolvedValue(void 0),b=c.fn().mockResolvedValue(void 0),g=i=>{const n=w.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(I,{children:[o.jsx("h6",{ref:n,children:"Interaction Test"}),o.jsx(B.Provider,{value:{anchorRef:n,value:null,updateValue:t,data:{value:""},colId:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:r=>r,stopEditing:()=>{}},children:o.jsx(x,{...i,options:()=>[{label:"Enabled",value:1,action:s},f,{label:"Disabled",value:0,disabled:!0,action:b},{label:"Sub text input",value:0,subComponent:()=>o.jsx(C,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})},{label:"Sub text area",value:0,subComponent:()=>o.jsx(y,{placeholder:"Text area",maxLength:5,required:!0,defaultValue:""})},{label:"ERROR! this should be hidden",value:3,hidden:!0}]})})]})})},d=g.bind({});d.play=async({canvasElement:i})=>{const n=P(i),r=T=>n.findByRole("menuitem",{name:T}),p=await r("Enabled");e(p).toBeInTheDocument(),await a.click(p),e(s).toHaveBeenCalled(),s.mockClear();const m=await r("Disabled");e(m).toBeInTheDocument(),await a.click(m),e(b).not.toHaveBeenCalled();const h=await r("Sub text input");e(h).toBeInTheDocument(),e(n.queryByPlaceholderText("Text input")).not.toBeInTheDocument();const v=await r("Sub text area");e(v).toBeInTheDocument(),e(n.queryByPlaceholderText("Text area")).not.toBeInTheDocument(),await a.click(h);const l=await n.findByPlaceholderText("Text input");e(l).toBeInTheDocument(),e(await n.findByText("Must not be empty")).toBeInTheDocument(),e(n.queryByPlaceholderText("Text area")).not.toBeInTheDocument(),await a.type(l,"Hello"),e(await n.findByText("Press enter or tab to save")).toBeInTheDocument(),t.mockClear(),await a.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await a.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await a.type(l,"{Escape}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await a.clear(l),await a.type(l,"{Enter}"),e(t).not.toHaveBeenCalled(),v.click();const u=await n.findByPlaceholderText("Text area");e(u).toBeInTheDocument(),e(await n.findByText("Must not be empty")).toBeInTheDocument(),e(n.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await a.type(u,"Hello"),e(await n.findByText("Press tab to save")).toBeInTheDocument(),t.mockClear(),await a.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await a.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await a.type(u,"{Escape}"),e(t).toHaveBeenCalledWith(e.anything(),0),t.mockClear(),await a.clear(u),await a.type(u,"{Enter}"),e(t).not.toHaveBeenCalled()};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`(props: GridFormPopoverMenuProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={'react-menu-inline-test'}>
      <GridContextProvider>
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
        formatValue: value => value,
        stopEditing: () => {}
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
      </GridContextProvider>
    </div>;
}`,...d.parameters?.docs?.source}}};const q=["GridFormPopoverMenuInteractions_"];export{d as GridFormPopoverMenuInteractions_,q as __namedExportsOrder,V as default};
