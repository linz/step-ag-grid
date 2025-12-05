import{j as e,w}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as t}from"./iframe-fuNulc0f.js";import{G as d}from"./GridWrapper-BAUk9ZaG.js";import{G as c,b as f,M as C}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as h,a as D}from"./GridUpdatingContextProvider-B4NLo6bu.js";import{A as I}from"./ActionButton-DT6uCTh5.js";import{w as S}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const B={title:"Components / Grids",component:c,args:{quickFilterValue:"",selectable:!0},decorators:[n=>e.jsx("div",{style:{width:1024,height:400},children:e.jsx(h,{children:e.jsx(D,{children:e.jsx(n,{})})})})]},G=({clickedRow:n,colDef:a,close:i})=>{const r=t.useCallback(()=>{switch(a.field){case"name":n.name="";break;case"distance":n.distance=null;break}i()},[i,a.field,n]);return e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:r,children:"Button - Clear cell"}),e.jsx(C,{onClick:r,children:"Menu Item - Clear cell"})]})},b=n=>{const{selectRowsWithFlashDiff:a}=t.useContext(f),[i,r]=t.useState([]),[o,u]=t.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",distance:10},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",distance:null}]),p=t.useMemo(()=>[d({field:"id",headerName:"Id"}),d({field:"name",headerName:"Name"}),d({field:"distance",headerName:"Number input",valueFormatter:({data:l})=>{const m=l?.distance;return m!=null?`${m}m`:"–"}})],[]),x=t.useCallback(async()=>{await w(1e3);const l=o[o.length-1];await a(async()=>{u([...o,{id:(l?.id??0)+1,name:"?",nameType:"?",numba:"?",plan:"",distance:null,bold:!1}])})},[o,a]);return e.jsxs(e.Fragment,{children:[e.jsx(c,{...n,externalSelectedItems:i,setExternalSelectedItems:r,columnDefs:p,rowData:o,domLayout:"autoHeight",defaultColDef:{minWidth:70},sizeColumns:"auto",onBulkEditingComplete:()=>{console.log("onBulkEditingComplete()")},contextMenu:G}),e.jsx(I,{icon:"ic_add",name:"Add new row",inProgressName:"Adding...",onClick:x})]})},s=b.bind({});s.play=S;s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridProps<IFormTestRow>) => {
  const {
    selectRowsWithFlashDiff
  } = useContext(GridContext);
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const [rowData, setRowData] = useState([{
    id: 1000,
    name: 'IS IS DP12345',
    nameType: 'IS',
    numba: 'IX',
    plan: 'DP 12345',
    distance: 10
  }, {
    id: 1001,
    name: 'PEG V SD523',
    nameType: 'PEG',
    numba: 'V',
    plan: 'SD 523',
    distance: null
  }] as IFormTestRow[]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridCell({
    field: 'name',
    headerName: 'Name'
  }), GridCell({
    field: 'distance',
    headerName: 'Number input',
    valueFormatter: ({
      data
    }) => {
      const v = data?.distance;
      return v != null ? \`\${v}m\` : '–';
    }
  })], []);
  const addRowAction = useCallback(async () => {
    await wait(1000);
    const lastRow = rowData[rowData.length - 1];
    // eslint-disable-next-line @typescript-eslint/require-await
    await selectRowsWithFlashDiff(async () => {
      setRowData([...rowData, {
        id: (lastRow?.id ?? 0) + 1,
        name: '?',
        nameType: '?',
        numba: '?',
        plan: '',
        distance: null,
        bold: false
      }]);
    });
  }, [rowData, selectRowsWithFlashDiff]);
  return <>
      <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} defaultColDef={{
      minWidth: 70
    }} sizeColumns={'auto'} onBulkEditingComplete={() => {
      /* eslint-disable-next-line no-console */
      console.log('onBulkEditingComplete()');
    }} contextMenu={ContextMenu} />
      <ActionButton icon={'ic_add'} name={'Add new row'} inProgressName={'Adding...'} onClick={addRowAction} />
    </>;
}`,...s.parameters?.docs?.source}}};const _=["_EditContextMenu"];export{s as _EditContextMenu,_ as __namedExportsOrder,B as default};
