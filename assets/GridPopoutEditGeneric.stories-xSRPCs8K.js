import{w as E,j as e,b as N,d as T,L as p,e as h}from"./util-Bw02gGHb.js";/* empty css                  */import{G as b,a as w}from"./GridUpdatingContextProvider-Duqjn_xW.js";import"./stateDeferredHook-DLHxM2Up.js";import{r as t}from"./iframe-h4MqiH0z.js";import{u as P,h as C,F as D,G as x}from"./GridWrapper-CbDPn0wg.js";import{G as S}from"./Grid-P3HtWBHg.js";import"./ActionButton-QdnM2Y72.js";import{w as F}from"./storybookTestUtil-D13wlVSp.js";import"./index-Dn-ukQb7.js";import"./preload-helper-Ct5FWWRu.js";const c=a=>{const{value:i}=P(),[l,...d]=i.split(" "),[r,v]=t.useState(l),[s,g]=t.useState(d.join(" ")),G=t.useCallback(async n=>(console.log("onSave",n,r,s),n.forEach(I=>I.name=[r,s].join(" ")),await E(1e3),!0),[r,s]),u=t.useCallback(()=>s.length<3?"Number should be at least 3 characters":null,[s.length]),[f,m]=t.useState(!1),{popoverWrapper:j,triggerSave:y}=C({className:a.className,invalid:u,save:G});return j(e.jsxs(e.Fragment,{children:[f&&e.jsxs(N,{"data-testid":"WarningAlertWithButtons-modal",level:"warning",children:[e.jsx("h2",{children:"Header"}),e.jsx("p",{className:"WarningAlertWithButtons-new-line",children:"This modal was added to help fix a bug where the onBlur for the context menu was prematurely closing the editor and therefore this modal."}),e.jsxs(T,{children:[e.jsx(p,{level:"secondary",onClick:()=>{m(!1)},"data-testid":"WarningAlertWithButtons-cancel",children:"Cancel"}),e.jsx(p,{level:"primary",onClick:()=>{m(!1),y()},"data-testid":"WarningAlertWithButtons-ok",children:"OK"})]})]}),e.jsxs("div",{className:"Grid-popoverContainer",children:[e.jsxs("div",{className:"FormTest",children:[e.jsx("div",{className:"FormTest-textInput",children:e.jsx(h,{label:"Name type",value:r,onChange:n=>v(n.target.value)})}),e.jsx("div",{className:"FormTest-textInput",children:e.jsx(h,{label:"Number",value:s,onChange:n=>g(n.target.value)})}),e.jsx("div",{style:{marginTop:25},children:e.jsx("input",{"data-disableenterautosave":!0,type:"button",style:{height:48},onClick:()=>m(!0),value:"Show Modal"})})]}),e.jsx(D,{error:u()})]})]}))};try{c.displayName="FormTest",c.__docgenInfo={description:"",displayName:"FormTest",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const X={title:"Components / Grids",component:S,args:{quickFilterValue:"",selectable:!0},decorators:[a=>e.jsx("div",{style:{width:1024,height:400},children:e.jsx(b,{children:e.jsx(w,{children:e.jsx(a,{})})})})]},_=a=>{const[i,l]=t.useState([]),d=t.useMemo(()=>[x({field:"id",headerName:"Id"}),x({field:"name",headerName:"Popout Generic Edit"},{multiEdit:!0,editor:c,editorParams:{}})],[]),[r]=t.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345"},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523"}]);return e.jsx(S,{...a,externalSelectedItems:i,setExternalSelectedItems:l,columnDefs:d,rowData:r,domLayout:"autoHeight"})},o=_.bind({});o.play=F;o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`(props: GridProps) => {
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
}`,...o.parameters?.docs?.source}}};const K=["_EditGeneric"];export{o as _EditGeneric,K as __namedExportsOrder,X as default};
