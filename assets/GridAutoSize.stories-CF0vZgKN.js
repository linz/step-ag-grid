import{j as e}from"./util-B1lB3GhT.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Cj269tWz.js";import{r}from"./iframe-smKoh4tb.js";import{G as n}from"./GridWrapper-DtoEoUNi.js";import{G as a}from"./Grid-Q3rFMtHJ.js";import"./client-Kh56r61r.js";import{G as d,a as u}from"./GridUpdatingContextProvider-qT4OMujP.js";import"./ActionButton-Bm-II8tU.js";import{w as S}from"./storybookTestUtil-CmriYLwu.js";import{F as G}from"./FormTest-CCN5SgIW.js";import"./index-WFabMzKZ.js";import"./preload-helper-PPVm8Dsz.js";const b={title:"Components / Grid Size",component:a,args:{quickFilterValue:"",selectable:!0},decorators:[o=>e.jsx(d,{children:e.jsx(u,{children:e.jsx(o,{})})})]},c=o=>{const[s,i]=r.useState([]),m=r.useMemo(()=>[n({field:"id",headerName:"Id"}),n({field:"name",headerName:"Popout Generic Edit",flex:1},{multiEdit:!0,editor:G,editorParams:{}})],[]),[l]=r.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345"},{id:1001,name:"PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523"}]);return e.jsxs(e.Fragment,{children:["Auto-size. Col 1 should autosize, Col 2 should flex to fill.",e.jsx(a,{...o,externalSelectedItems:s,setExternalSelectedItems:i,columnDefs:m,hideSelectColumn:!0,selectable:!0,rowData:l,domLayout:"autoHeight"})]})},t=c.bind({});t.play=S;t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(props: GridProps<IFormTestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
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
    name: 'PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523',
    nameType: 'PEG',
    numba: 'V',
    plan: 'SD 523'
  }] as IFormTestRow[]);
  return <>
      Auto-size. Col 1 should autosize, Col 2 should flex to fill.
      <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} hideSelectColumn={true} selectable={true} rowData={rowData} domLayout={'autoHeight'} />
    </>;
}`,...t.parameters?.docs?.source}}};const z=["_AutoSize"];export{t as _AutoSize,z as __namedExportsOrder,b as default};
