import{j as o}from"./jsx-runtime-DEdD30eg.js";/* empty css              */import"./GridUpdatingContextProvider-C0OJ_AZp.js";import"./stateDeferredHook-DIITot2w.js";import{f as c,w as f,e,u as n}from"./index-8uelxQvJ.js";import{m as B,e as y,f as C}from"./GridWrapper-y58xtKL0.js";import{r as w}from"./index-RYns6xqu.js";import{b as P}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import"./util-CWqzvxZb.js";import{G as x,P as I}from"./GridFormPopoverMenu-DyaAWYt_.js";import"./ActionButton-BnaFCZwL.js";const A={title:"GridForm / Interactions",component:x,args:{}},t=c((l,a)=>l([])),d=c().mockResolvedValue(void 0),b=c().mockResolvedValue(void 0),g=l=>{const a=w.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(P.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(B.Provider,{value:{anchorRef:a,value:null,updateValue:t,data:{value:""},colId:"",field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:r=>r},children:o.jsx(x,{...l,options:async()=>[{label:"Enabled",value:1,action:d},I,{label:"Disabled",value:0,disabled:!0,action:b},{label:"Sub text input",value:0,subComponent:()=>o.jsx(y,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})},{label:"Sub text area",value:0,subComponent:()=>o.jsx(C,{placeholder:"Text area",maxLength:5,required:!0,defaultValue:""})},{label:"ERROR! this should be hidden",value:3,hidden:!0}]})})]})})},s=g.bind({});s.play=async({canvasElement:l})=>{const a=f(l),r=T=>a.findByRole("menuitem",{name:T}),m=await r("Enabled");e(m).toBeInTheDocument(),await n.click(m),e(d).toHaveBeenCalled(),d.mockClear();const p=await r("Disabled");e(p).toBeInTheDocument(),await n.click(p),e(b).not.toHaveBeenCalled();const v=await r("Sub text input");e(v).toBeInTheDocument(),e(a.queryByPlaceholderText("Text input")).not.toBeInTheDocument();const h=await r("Sub text area");e(h).toBeInTheDocument(),e(a.queryByPlaceholderText("Text area")).not.toBeInTheDocument(),await n.click(v);const i=await a.findByPlaceholderText("Text input");e(i).toBeInTheDocument(),e(await a.findByText("Must not be empty")).toBeInTheDocument(),e(a.queryByPlaceholderText("Text area")).not.toBeInTheDocument(),await n.type(i,"Hello"),e(await a.findByText("Press enter or tab to save")).toBeInTheDocument(),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(i,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await n.clear(i),await n.type(i,"{Enter}"),e(t).not.toHaveBeenCalled(),h.click();const u=await a.findByPlaceholderText("Text area");e(u).toBeInTheDocument(),e(await a.findByText("Must not be empty")).toBeInTheDocument(),e(a.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await n.type(u,"Hello"),e(await a.findByText("Press tab to save")).toBeInTheDocument(),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(u,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await n.clear(u),await n.type(u,"{Enter}"),e(t).not.toHaveBeenCalled()};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridFormPopoverMenuProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={"react-menu-inline-test"}>
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
          value: ""
        },
        colId: "",
        field: "value",
        selectedRows: [],
        saving: false,
        setSaving: () => {},
        formatValue: value => value
      }}>
          <GridFormPopoverMenu {...props} options={async () => [{
          label: "Enabled",
          value: 1,
          action: enabledAction
        }, PopoutMenuSeparator, {
          label: "Disabled",
          value: 0,
          disabled: true,
          action: disabledAction
        }, {
          label: "Sub text input",
          value: 0,
          subComponent: () => <GridFormSubComponentTextInput placeholder={"Text input"} maxLength={5} required defaultValue={""} />
        }, {
          label: "Sub text area",
          value: 0,
          subComponent: () => <GridFormSubComponentTextArea placeholder={"Text area"} maxLength={5} required defaultValue={""} />
        }, {
          label: "ERROR! this should be hidden",
          value: 3,
          hidden: true
        }]} />
        </GridPopoverContext.Provider>
      </GridContext.Provider>
    </div>;
}`,...s.parameters?.docs?.source}}};const O=["GridFormPopoverMenuInteractions_"];export{s as GridFormPopoverMenuInteractions_,O as __namedExportsOrder,A as default};
