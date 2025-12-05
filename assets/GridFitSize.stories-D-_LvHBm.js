import{j as e}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as o}from"./iframe-fuNulc0f.js";import{G as n}from"./GridWrapper-BAUk9ZaG.js";import{G as a}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as l,a as S}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as c}from"./storybookTestUtil-CrgKzGmM.js";import{F as u}from"./FormTest-BQBauLbc.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const b={title:"Components / Grid Size",component:a,args:{quickFilterValue:"",selectable:!0},decorators:[r=>e.jsx(l,{children:e.jsx(S,{children:e.jsx(r,{})})})]},p=r=>{const[s,i]=o.useState([]),m=o.useMemo(()=>[n({field:"id",headerName:"Id"}),n({field:"name",headerName:"Popout Generic Edit"},{multiEdit:!0,editor:u,editorParams:{}})],[]),[d]=o.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345"},{id:1001,name:"PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523"}]);return e.jsxs(e.Fragment,{children:["Equisized flex columns spread across container",e.jsx(a,{...r,externalSelectedItems:s,setExternalSelectedItems:i,columnDefs:m,sizeColumns:"fit",hideSelectColumn:!0,selectable:!0,rowData:d,domLayout:"autoHeight"})]})},t=p.bind({});t.play=c;t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(props: GridProps<IFormTestRow>) => {
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
    name: 'PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523',
    nameType: 'PEG',
    numba: 'V',
    plan: 'SD 523'
  }] as IFormTestRow[]);
  return <>
      Equisized flex columns spread across container
      <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} sizeColumns={'fit'} hideSelectColumn={true} selectable={true} rowData={rowData} domLayout={'autoHeight'} />
    </>;
}`,...t.parameters?.docs?.source}}};const z=["_FitSize"];export{t as _FitSize,z as __namedExportsOrder,b as default};
