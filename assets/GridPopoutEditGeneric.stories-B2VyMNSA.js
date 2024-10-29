import{j as e}from"./jsx-runtime-DEdD30eg.js";/* empty css                  */import{G as E,a as y}from"./GridUpdatingContextProvider-C0OJ_AZp.js";import"./stateDeferredHook-DIITot2w.js";import{r as t}from"./index-RYns6xqu.js";import{o as w,p as P,F as b,G as u}from"./GridWrapper-y58xtKL0.js";import{G as x}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import{w as T,d as C,e as D,a as p,g as h}from"./util-CWqzvxZb.js";import"./ActionButton-BnaFCZwL.js";import{w as N}from"./storybookTestUtil-CYGWFEhE.js";import"./index-8uelxQvJ.js";const F=s=>{const{value:i}=w(),[l,...d]=i.split(" "),[a,S]=t.useState(l),[r,v]=t.useState(d.join(" ")),G=t.useCallback(async n=>(console.log("onSave",n,a,r),n.forEach(I=>I.name=[a,r].join(" ")),await T(1e3),!0),[a,r]),c=t.useCallback(()=>r.length<3?"Number should be at least 3 characters":null,[r.length]),[g,m]=t.useState(!1),{popoverWrapper:f,triggerSave:j}=P({className:s.className,invalid:c,save:G});return f(e.jsxs(e.Fragment,{children:[g&&e.jsxs(C,{"data-testid":"WarningAlertWithButtons-modal",level:"warning",children:[e.jsx("h2",{children:"Header"}),e.jsx("p",{className:"WarningAlertWithButtons-new-line",children:"This modal was added to help fix a bug where the onBlur for the context menu was prematurely closing the editor and therefore this modal."}),e.jsxs(D,{children:[e.jsx(p,{level:"secondary",onClick:()=>{m(!1)},"data-testid":"WarningAlertWithButtons-cancel",children:"Cancel"}),e.jsx(p,{level:"primary",onClick:()=>{m(!1),j().then()},"data-testid":"WarningAlertWithButtons-ok",children:"OK"})]})]}),e.jsxs("div",{className:"Grid-popoverContainer",children:[e.jsxs("div",{className:"FormTest",children:[e.jsx("div",{className:"FormTest-textInput",children:e.jsx(h,{label:"Name type",value:a,onChange:n=>S(n.target.value)})}),e.jsx("div",{className:"FormTest-textInput",children:e.jsx(h,{label:"Number",value:r,onChange:n=>v(n.target.value)})}),e.jsx("div",{style:{marginTop:25},children:e.jsx("input",{"data-disableenterautosave":!0,type:"button",style:{height:48},onClick:()=>m(!0),value:"Show Modal"})})]}),e.jsx(b,{error:c()})]})]}))},K={title:"Components / Grids",component:x,args:{quickFilterValue:"",selectable:!0},decorators:[s=>e.jsx("div",{style:{width:1024,height:400},children:e.jsx(E,{children:e.jsx(y,{children:e.jsx(s,{})})})})]},W=s=>{const[i,l]=t.useState([]),d=t.useMemo(()=>[u({field:"id",headerName:"Id"}),u({field:"name",headerName:"Popout Generic Edit"},{multiEdit:!0,editor:F,editorParams:{}})],[]),[a]=t.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345"},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523"}]);return e.jsx(x,{...s,externalSelectedItems:i,setExternalSelectedItems:l,columnDefs:d,rowData:a,domLayout:"autoHeight"})},o=W.bind({});o.play=N;o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(() => [GridCell({
    field: "id",
    headerName: "Id"
  }), GridCell({
    field: "name",
    headerName: "Popout Generic Edit"
  }, {
    multiEdit: true,
    editor: FormTest,
    editorParams: {}
  })], []);
  const [rowData] = useState([{
    id: 1000,
    name: "IS IS DP12345",
    nameType: "IS",
    numba: "IX",
    plan: "DP 12345"
  }, {
    id: 1001,
    name: "PEG V SD523",
    nameType: "PEG",
    numba: "V",
    plan: "SD 523"
  }] as IFormTestRow[]);
  return <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={"autoHeight"} />;
}`,...o.parameters?.docs?.source}}};const U=["_EditGeneric"];export{o as _EditGeneric,U as __namedExportsOrder,K as default};
