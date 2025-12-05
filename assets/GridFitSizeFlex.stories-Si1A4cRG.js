import{j as e}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as o}from"./iframe-fuNulc0f.js";import{G as n}from"./GridWrapper-BAUk9ZaG.js";import{G as s}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as d,a as c}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as S}from"./storybookTestUtil-CrgKzGmM.js";import{F as u}from"./FormTest-BQBauLbc.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const y={title:"Components / Grid Size",component:s,args:{quickFilterValue:"",selectable:!0},decorators:[r=>e.jsx(d,{children:e.jsx(c,{children:e.jsx(r,{})})})]},p=r=>{const[a,i]=o.useState([]),m=o.useMemo(()=>[n({field:"id",headerName:"Id",flex:2}),n({field:"name",headerName:"Popout Generic Edit",flex:1},{multiEdit:!0,editor:u,editorParams:{}})],[]),[l]=o.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345"},{id:1001,name:"PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523"}]);return e.jsxs(e.Fragment,{children:["1:3 flex columns spread across container. These columns should not be the same size.",e.jsx(s,{...r,externalSelectedItems:a,setExternalSelectedItems:i,columnDefs:m,sizeColumns:"fit",hideSelectColumn:!0,selectable:!0,rowData:l,domLayout:"autoHeight"})]})},t=p.bind({});t.play=S;t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(props: GridProps<IFormTestRow>) => {
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
    name: 'PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523PEG V SD523',
    nameType: 'PEG',
    numba: 'V',
    plan: 'SD 523'
  }] as IFormTestRow[]);
  return <>
      1:3 flex columns spread across container. These columns should not be the same size.
      <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} sizeColumns={'fit'} hideSelectColumn={true} selectable={true} rowData={rowData} domLayout={'autoHeight'} />
    </>;
}`,...t.parameters?.docs?.source}}};const z=["_FitSizeFlex"];export{t as _FitSizeFlex,z as __namedExportsOrder,y as default};
