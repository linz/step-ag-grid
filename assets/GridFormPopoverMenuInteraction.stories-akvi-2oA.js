import{j as o}from"./jsx-runtime-QvZ8i92b.js";/* empty css              */import"./GridUpdatingContextProvider-B57ju6NF.js";import"./stateDeferredHook-3pr3Jmby.js";import{f as c,w as f,e,u as n}from"./index-BsSOpHTy.js";import{m as B,e as y,f as C}from"./GridWrapper-DJOqlb4b.js";import{r as w}from"./index-uubelm5h.js";import{b as P}from"./Grid-CzMsKtE0.js";import"./index-CMOtJUyO.js";import"./util-BMTC4KOK.js";import{G as x,P as I}from"./GridFormPopoverMenu-ZxOdRx-U.js";import"./ActionButton-CKl6PlbN.js";import"./index-U6Do-Xt6.js";const O={title:"GridForm / Interactions",component:x,args:{}},t=c((i,a)=>i([])),d=c().mockResolvedValue(void 0),b=c().mockResolvedValue(void 0),g=i=>{const a=w.useRef(null);return o.jsx("div",{className:"react-menu-inline-test",children:o.jsxs(P.Provider,{value:{stopEditing:()=>{},cancelEdit:()=>{}},children:[o.jsx("h6",{ref:a,children:"Interaction Test"}),o.jsx(B.Provider,{value:{anchorRef:a,value:null,updateValue:t,data:{value:""},field:"value",selectedRows:[],saving:!1,setSaving:()=>{},formatValue:r=>r},children:o.jsx(x,{...i,options:async()=>[{label:"Enabled",value:1,action:d},I,{label:"Disabled",value:0,disabled:!0,action:b},{label:"Sub text input",value:0,subComponent:()=>o.jsx(y,{placeholder:"Text input",maxLength:5,required:!0,defaultValue:""})},{label:"Sub text area",value:0,subComponent:()=>o.jsx(C,{placeholder:"Text area",maxLength:5,required:!0,defaultValue:""})},{label:"ERROR! this should be hidden",value:3,hidden:!0}]})})]})})},s=g.bind({});s.play=async({canvasElement:i})=>{const a=f(i),r=T=>a.findByRole("menuitem",{name:T}),m=await r("Enabled");e(m).toBeInTheDocument(),await n.click(m),e(d).toHaveBeenCalled(),d.mockClear();const p=await r("Disabled");e(p).toBeInTheDocument(),await n.click(p),e(b).not.toHaveBeenCalled();const v=await r("Sub text input");e(v).toBeInTheDocument(),e(a.queryByPlaceholderText("Text input")).not.toBeInTheDocument();const h=await r("Sub text area");e(h).toBeInTheDocument(),e(a.queryByPlaceholderText("Text area")).not.toBeInTheDocument(),await n.click(v);const l=await a.findByPlaceholderText("Text input");e(l).toBeInTheDocument(),e(await a.findByText("Must not be empty")).toBeInTheDocument(),e(a.queryByPlaceholderText("Text area")).not.toBeInTheDocument(),await n.type(l,"Hello"),e(await a.findByText("Press enter or tab to save")).toBeInTheDocument(),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(l,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await n.clear(l),await n.type(l,"{Enter}"),e(t).not.toHaveBeenCalled(),h.click();const u=await a.findByPlaceholderText("Text area");e(u).toBeInTheDocument(),e(await a.findByText("Must not be empty")).toBeInTheDocument(),e(a.queryByPlaceholderText("Text input")).not.toBeInTheDocument(),await n.type(u,"Hello"),e(await a.findByText("Press tab to save")).toBeInTheDocument(),t.mockClear(),await n.tab(),e(t).toHaveBeenCalledWith(e.anything(),1),t.mockClear(),await n.tab({shift:!0}),e(t).toHaveBeenCalledWith(e.anything(),-1),t.mockClear(),await n.type(u,"{Escape}"),e(t).not.toHaveBeenCalled(),t.mockClear(),await n.clear(u),await n.type(u,"{Enter}"),e(t).not.toHaveBeenCalled()};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridFormPopoverMenuProps<any>) => {
  const anchorRef = useRef<HTMLHeadingElement>(null);
  return <div className={"react-menu-inline-test"}>
      <GridContext.Provider value={({
      stopEditing: () => {},
      cancelEdit: () => {}
    } as any)}>
        <h6 ref={anchorRef}>Interaction Test</h6>
        <GridPopoverContext.Provider value={{
        anchorRef,
        value: null,
        updateValue,
        data: {
          value: ""
        },
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
}`,...s.parameters?.docs?.source}}};const _=["GridFormPopoverMenuInteractions_"];export{s as GridFormPopoverMenuInteractions_,_ as __namedExportsOrder,O as default};
