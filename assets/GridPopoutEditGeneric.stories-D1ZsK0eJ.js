import{j as e}from"./index-uvRZkhe0.js";/* empty css                  */import{G as E,a as N}from"./GridUpdatingContextProvider-DYGM_UmY.js";import"./stateDeferredHook-Dh_hbzWK.js";import{r as t}from"./index-DQDNmYQF.js";import{F as T,H as w,I as P,G as p}from"./GridWrapper-KGmbnRqr.js";import{G as S}from"./Grid-Cf9uaoEg.js";import{w as b,d as C,e as D,L as h,g as x}from"./util-CYV73bPB.js";import"./ActionButton-BDYCoy1d.js";import{w as F}from"./storybookTestUtil-DBFt3sMW.js";import"./index-DYVtDik4.js";import"./index-BFcdsecu.js";const c=a=>{const{value:i}=T(),[l,...d]=i.split(" "),[r,g]=t.useState(l),[s,v]=t.useState(d.join(" ")),f=t.useCallback(async n=>(console.log("onSave",n,r,s),n.forEach(I=>I.name=[r,s].join(" ")),await b(1e3),!0),[r,s]),u=t.useCallback(()=>s.length<3?"Number should be at least 3 characters":null,[s.length]),[G,m]=t.useState(!1),{popoverWrapper:j,triggerSave:y}=w({className:a.className,invalid:u,save:f});return j(e.jsxs(e.Fragment,{children:[G&&e.jsxs(C,{"data-testid":"WarningAlertWithButtons-modal",level:"warning",children:[e.jsx("h2",{children:"Header"}),e.jsx("p",{className:"WarningAlertWithButtons-new-line",children:"This modal was added to help fix a bug where the onBlur for the context menu was prematurely closing the editor and therefore this modal."}),e.jsxs(D,{children:[e.jsx(h,{level:"secondary",onClick:()=>{m(!1)},"data-testid":"WarningAlertWithButtons-cancel",children:"Cancel"}),e.jsx(h,{level:"primary",onClick:()=>{m(!1),y()},"data-testid":"WarningAlertWithButtons-ok",children:"OK"})]})]}),e.jsxs("div",{className:"Grid-popoverContainer",children:[e.jsxs("div",{className:"FormTest",children:[e.jsx("div",{className:"FormTest-textInput",children:e.jsx(x,{label:"Name type",value:r,onChange:n=>g(n.target.value)})}),e.jsx("div",{className:"FormTest-textInput",children:e.jsx(x,{label:"Number",value:s,onChange:n=>v(n.target.value)})}),e.jsx("div",{style:{marginTop:25},children:e.jsx("input",{"data-disableenterautosave":!0,type:"button",style:{height:48},onClick:()=>m(!0),value:"Show Modal"})})]}),e.jsx(P,{error:u()})]})]}))};try{c.displayName="FormTest",c.__docgenInfo={description:"",displayName:"FormTest",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const K={title:"Components / Grids",component:S,args:{quickFilterValue:"",selectable:!0},decorators:[a=>e.jsx("div",{style:{width:1024,height:400},children:e.jsx(E,{children:e.jsx(N,{children:e.jsx(a,{})})})})]},_=a=>{const[i,l]=t.useState([]),d=t.useMemo(()=>[p({field:"id",headerName:"Id"}),p({field:"name",headerName:"Popout Generic Edit"},{multiEdit:!0,editor:c,editorParams:{}})],[]),[r]=t.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345"},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523"}]);return e.jsx(S,{...a,externalSelectedItems:i,setExternalSelectedItems:l,columnDefs:d,rowData:r,domLayout:"autoHeight"})},o=_.bind({});o.play=F;o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`(props: GridProps) => {
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
}`,...o.parameters?.docs?.source}}};const U=["_EditGeneric"];export{o as _EditGeneric,U as __namedExportsOrder,K as default};
