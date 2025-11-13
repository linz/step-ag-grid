import{w as E,j as e,d as T,e as N,a as p,g as h}from"./util-CgugAU5W.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-DLMcti5_.js";import{r as t}from"./iframe-qoNDcQrb.js";import{u as w,h as P,F as b,G as x}from"./GridWrapper-ByjUL_3E.js";import{G as f}from"./Grid-vjV2ljNn.js";import"./client-DIuOxkbO.js";import{G as C,a as D}from"./GridUpdatingContextProvider-CR4twmSI.js";import"./ActionButton-CzX0v5O0.js";import{w as F}from"./storybookTestUtil-D13wlVSp.js";import"./index-2kSpQblA.js";import"./preload-helper-PPVm8Dsz.js";const c=a=>{const{value:i}=w(),[l,...d]=i.split(" "),[r,S]=t.useState(l),[n,g]=t.useState(d.join(" ")),v=t.useCallback(async s=>(console.log("onSave",s,r,n),s.forEach(y=>y.name=[r,n].join(" ")),await E(1e3),!0),[r,n]),u=t.useCallback(()=>n.length<3?"Number should be at least 3 characters":null,[n.length]),[G,m]=t.useState(!1),{popoverWrapper:I,triggerSave:j}=P({className:a.className,invalid:u,save:v});return I(e.jsxs(e.Fragment,{children:[G&&e.jsxs(T,{"data-testid":"WarningAlertWithButtons-modal",level:"warning",children:[e.jsx("h2",{children:"Header"}),e.jsx("p",{className:"WarningAlertWithButtons-new-line",children:"This modal was added to help fix a bug where the onBlur for the context menu was prematurely closing the editor and therefore this modal."}),e.jsxs(N,{children:[e.jsx(p,{level:"secondary",onClick:()=>{m(!1)},"data-testid":"WarningAlertWithButtons-cancel",children:"Cancel"}),e.jsx(p,{level:"primary",onClick:()=>{m(!1),j()},"data-testid":"WarningAlertWithButtons-ok",children:"OK"})]})]}),e.jsxs("div",{className:"Grid-popoverContainer",children:[e.jsxs("div",{className:"FormTest",children:[e.jsx("div",{className:"FormTest-textInput",children:e.jsx(h,{label:"Name type",value:r,onChange:s=>S(s.target.value)})}),e.jsx("div",{className:"FormTest-textInput",children:e.jsx(h,{label:"Number",value:n,onChange:s=>g(s.target.value)})}),e.jsx("div",{style:{marginTop:25},children:e.jsx("input",{"data-disableenterautosave":!0,type:"button",style:{height:48},onClick:()=>m(!0),value:"Show Modal"})})]}),e.jsx(b,{error:u()})]})]}))};try{c.displayName="FormTest",c.__docgenInfo={description:"",displayName:"FormTest",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const U={title:"Components / Grids",component:f,args:{quickFilterValue:"",selectable:!0},decorators:[a=>e.jsx(C,{children:e.jsx(D,{children:e.jsx(a,{})})})]},_=a=>{const[i,l]=t.useState([]),d=t.useMemo(()=>[x({field:"id",headerName:"Id",flex:2}),x({field:"name",headerName:"Popout Generic Edit",flex:1},{multiEdit:!0,editor:c,editorParams:{}})],[]),[r]=t.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345"},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523"}]);return e.jsx(f,{...a,externalSelectedItems:i,setExternalSelectedItems:l,columnDefs:d,rowData:r,domLayout:"autoHeight"})},o=_.bind({});o.play=F;o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`(props: GridProps<IFormTestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id',
    flex: 2
  }), GridCell({
    field: 'name',
    headerName: 'Popout Generic Edit',
    flex: 1
  }, {
    multiEdit: true,
    editor: FormTest,
    editorParams: {}
  })], []);
  const [rowData] = useState([{
    id: 1000,
    name: 'IS IS DP12345',
    nameType: 'IS',
    numba: 'IX',
    plan: 'DP 12345'
  }, {
    id: 1001,
    name: 'PEG V SD523',
    nameType: 'PEG',
    numba: 'V',
    plan: 'SD 523'
  }] as IFormTestRow[]);
  return <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} />;
}`,...o.parameters?.docs?.source}}};const z=["_EditGeneric"];export{o as _EditGeneric,z as __namedExportsOrder,U as default};
