import{j as e}from"./index-_eCCCJMN.js";/* empty css                  */import{G as w,a as C}from"./GridUpdatingContextProvider-DK2uKtWm.js";import"./stateDeferredHook-9sbfsEJK.js";import{r as t}from"./index-ne9I_3bB.js";import{G as c,b as f,M as h}from"./Grid-BnijaEma.js";import{G as d}from"./GridWrapper-DVhisWkQ.js";import{w as D}from"./util-DX3mDqFH.js";import{A as S}from"./ActionButton-CwNE6oAT.js";import{w as G}from"./storybookTestUtil-B6V3sqEj.js";import"./index-JPfhvaY4.js";import"./index-DJy14G1K.js";const k={title:"Components / Grids",component:c,args:{quickFilterValue:"",selectable:!0},decorators:[n=>e.jsx("div",{style:{width:1024,height:400},children:e.jsx(w,{children:e.jsx(C,{children:e.jsx(n,{})})})})]},I=({clickedRow:n,colDef:a,close:i})=>{const l=t.useCallback(()=>{switch(a.field){case"name":n.name="";break;case"distance":n.distance=null;break}i()},[i,a.field,n]);return e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:l,children:"Button - Clear cell"}),e.jsx(h,{onClick:l,children:"Menu Item - Clear cell"})]})},b=n=>{const{selectRowsWithFlashDiff:a}=t.useContext(f),[i,l]=t.useState([]),[o,u]=t.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",distance:10},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",distance:null}]),p=t.useMemo(()=>[d({field:"id",headerName:"Id"}),d({field:"name",headerName:"Name"}),d({field:"distance",headerName:"Number input",valueFormatter:({data:r})=>{const m=r?.distance;return m!=null?`${m}m`:"–"}})],[]),x=t.useCallback(async()=>{await D(1e3);const r=o[o.length-1];await a(async()=>{u([...o,{id:(r?.id??0)+1,name:"?",nameType:"?",numba:"?",plan:"",distance:null,bold:!1}])})},[o,a]);return e.jsxs(e.Fragment,{children:[e.jsx(c,{...n,externalSelectedItems:i,setExternalSelectedItems:l,columnDefs:p,rowData:o,domLayout:"autoHeight",defaultColDef:{minWidth:70},sizeColumns:"auto",onCellEditingComplete:()=>{console.log("Cell editing complete")},contextMenu:I}),e.jsx(S,{icon:"ic_add",name:"Add new row",inProgressName:"Adding...",onClick:x})]})},s=b.bind({});s.play=G;s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridProps) => {
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
    }} sizeColumns={'auto'} onCellEditingComplete={() => {
      /* eslint-disable-next-line no-console */
      console.log('Cell editing complete');
    }} contextMenu={ContextMenu} />
      <ActionButton icon={'ic_add'} name={'Add new row'} inProgressName={'Adding...'} onClick={addRowAction} />
    </>;
}`,...s.parameters?.docs?.source}}};const _=["_EditContextMenu"];export{s as _EditContextMenu,_ as __namedExportsOrder,k as default};
