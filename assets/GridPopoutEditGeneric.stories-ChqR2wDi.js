import{j as t}from"./util-B1lB3GhT.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Cj269tWz.js";import{r as o}from"./iframe-smKoh4tb.js";import{G as n}from"./GridWrapper-DtoEoUNi.js";import{G as a}from"./Grid-Q3rFMtHJ.js";import"./client-Kh56r61r.js";import{G as l,a as c}from"./GridUpdatingContextProvider-qT4OMujP.js";import"./ActionButton-Bm-II8tU.js";import{w as p}from"./storybookTestUtil-CmriYLwu.js";import{F as u}from"./FormTest-CCN5SgIW.js";import"./index-WFabMzKZ.js";import"./preload-helper-PPVm8Dsz.js";const j={title:"Components / Grids",component:a,args:{quickFilterValue:"",selectable:!0},decorators:[r=>t.jsx(l,{children:t.jsx(c,{children:t.jsx(r,{})})})]},G=r=>{const[s,m]=o.useState([]),i=o.useMemo(()=>[n({field:"id",headerName:"Id"}),n({field:"name",headerName:"Popout Generic Edit"},{multiEdit:!0,editor:u,editorParams:{}})],[]),[d]=o.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345"},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523"}]);return t.jsx(a,{...r,externalSelectedItems:s,setExternalSelectedItems:m,columnDefs:i,hideSelectColumn:!0,selectable:!0,rowData:d,domLayout:"autoHeight"})},e=G.bind({});e.play=p;e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`(props: GridProps<IFormTestRow>) => {
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
  return <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} hideSelectColumn={true} selectable={true} rowData={rowData} domLayout={'autoHeight'} />;
}`,...e.parameters?.docs?.source}}};const g=["_EditGeneric"];export{e as _EditGeneric,g as __namedExportsOrder,j as default};
