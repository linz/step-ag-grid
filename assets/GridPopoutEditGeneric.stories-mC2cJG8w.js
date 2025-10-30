import{w as E,j as e,d as T,e as w,a as p,g as h}from"./util-ijFjlinu.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Du3IBcJj.js";import{r as t}from"./iframe-DlkmCGKI.js";import{u as N,h as P,F as b,G as x}from"./GridWrapper-BPNz-Kwc.js";import{G as S}from"./Grid-x2Pv4IEw.js";import"./client-iOTQfKt-.js";import{G as C,a as D}from"./GridUpdatingContextProvider-BzZAfXqp.js";import"./ActionButton-Ch-xL9UL.js";import{w as F}from"./storybookTestUtil-D13wlVSp.js";import"./index-cvdpWsZ8.js";import"./preload-helper-PPVm8Dsz.js";const c=a=>{const{value:i}=N(),[l,...d]=i.split(" "),[r,g]=t.useState(l),[s,v]=t.useState(d.join(" ")),G=t.useCallback(async n=>(console.log("onSave",n,r,s),n.forEach(I=>I.name=[r,s].join(" ")),await E(1e3),!0),[r,s]),u=t.useCallback(()=>s.length<3?"Number should be at least 3 characters":null,[s.length]),[f,m]=t.useState(!1),{popoverWrapper:j,triggerSave:y}=P({className:a.className,invalid:u,save:G});return j(e.jsxs(e.Fragment,{children:[f&&e.jsxs(T,{"data-testid":"WarningAlertWithButtons-modal",level:"warning",children:[e.jsx("h2",{children:"Header"}),e.jsx("p",{className:"WarningAlertWithButtons-new-line",children:"This modal was added to help fix a bug where the onBlur for the context menu was prematurely closing the editor and therefore this modal."}),e.jsxs(w,{children:[e.jsx(p,{level:"secondary",onClick:()=>{m(!1)},"data-testid":"WarningAlertWithButtons-cancel",children:"Cancel"}),e.jsx(p,{level:"primary",onClick:()=>{m(!1),y()},"data-testid":"WarningAlertWithButtons-ok",children:"OK"})]})]}),e.jsxs("div",{className:"Grid-popoverContainer",children:[e.jsxs("div",{className:"FormTest",children:[e.jsx("div",{className:"FormTest-textInput",children:e.jsx(h,{label:"Name type",value:r,onChange:n=>g(n.target.value)})}),e.jsx("div",{className:"FormTest-textInput",children:e.jsx(h,{label:"Number",value:s,onChange:n=>v(n.target.value)})}),e.jsx("div",{style:{marginTop:25},children:e.jsx("input",{"data-disableenterautosave":!0,type:"button",style:{height:48},onClick:()=>m(!0),value:"Show Modal"})})]}),e.jsx(b,{error:u()})]})]}))};try{c.displayName="FormTest",c.__docgenInfo={description:"",displayName:"FormTest",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const U={title:"Components / Grids",component:S,args:{quickFilterValue:"",selectable:!0},decorators:[a=>e.jsx("div",{style:{width:1024,height:400},children:e.jsx(C,{children:e.jsx(D,{children:e.jsx(a,{})})})})]},_=a=>{const[i,l]=t.useState([]),d=t.useMemo(()=>[x({field:"id",headerName:"Id"}),x({field:"name",headerName:"Popout Generic Edit"},{multiEdit:!0,editor:c,editorParams:{}})],[]),[r]=t.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345"},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523"}]);return e.jsx(S,{...a,externalSelectedItems:i,setExternalSelectedItems:l,columnDefs:d,rowData:r,domLayout:"autoHeight"})},o=_.bind({});o.play=F;o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`(props: GridProps<IFormTestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridCell({
    field: 'name',
    headerName: 'Popout Generic Edit'
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
