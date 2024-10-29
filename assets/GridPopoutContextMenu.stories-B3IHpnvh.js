import{j as e}from"./jsx-runtime-DEdD30eg.js";/* empty css                  */import{G as w,a as C}from"./GridUpdatingContextProvider-C0OJ_AZp.js";import"./stateDeferredHook-DIITot2w.js";import{r as t}from"./index-RYns6xqu.js";import{G as d}from"./GridWrapper-y58xtKL0.js";import{G as c,b as f,M as h}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import{w as D}from"./util-CWqzvxZb.js";import{A as S}from"./ActionButton-BnaFCZwL.js";import{w as G}from"./storybookTestUtil-CYGWFEhE.js";import"./index-8uelxQvJ.js";const k={title:"Components / Grids",component:c,args:{quickFilterValue:"",selectable:!0},decorators:[n=>e.jsx("div",{style:{width:1024,height:400},children:e.jsx(w,{children:e.jsx(C,{children:e.jsx(n,{})})})})]},I=({clickedRow:n,colDef:a,close:i})=>{const r=t.useCallback(()=>{switch(a.field){case"name":n.name="";break;case"distance":n.distance=null;break}i()},[i,a.field,n]);return e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:r,children:"Button - Clear cell"}),e.jsx(h,{onClick:r,children:"Menu Item - Clear cell"})]})},g=n=>{const{selectRowsWithFlashDiff:a}=t.useContext(f),[i,r]=t.useState([]),[o,u]=t.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",distance:10},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",distance:null}]),p=t.useMemo(()=>[d({field:"id",headerName:"Id"}),d({field:"name",headerName:"Name"}),d({field:"distance",headerName:"Number input",valueFormatter:({data:l})=>{const m=l?.distance;return m!=null?`${m}m`:"–"}})],[]),x=t.useCallback(async()=>{await D(1e3);const l=o[o.length-1];await a(async()=>{u([...o,{id:(l?.id??0)+1,name:"?",nameType:"?",numba:"?",plan:"",distance:null}])})},[o,a]);return e.jsxs(e.Fragment,{children:[e.jsx(c,{...n,externalSelectedItems:i,setExternalSelectedItems:r,columnDefs:p,rowData:o,domLayout:"autoHeight",defaultColDef:{minWidth:70},sizeColumns:"auto",onCellEditingComplete:()=>{console.log("Cell editing complete")},contextMenu:I}),e.jsx(S,{icon:"ic_add",name:"Add new row",inProgressName:"Adding...",onClick:x})]})},s=g.bind({});s.play=G;s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const {
    selectRowsWithFlashDiff
  } = useContext(GridContext);
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const [rowData, setRowData] = useState([{
    id: 1000,
    name: "IS IS DP12345",
    nameType: "IS",
    numba: "IX",
    plan: "DP 12345",
    distance: 10
  }, {
    id: 1001,
    name: "PEG V SD523",
    nameType: "PEG",
    numba: "V",
    plan: "SD 523",
    distance: null
  }] as IFormTestRow[]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(() => [GridCell({
    field: "id",
    headerName: "Id"
  }), GridCell({
    field: "name",
    headerName: "Name"
  }), GridCell({
    field: "distance",
    headerName: "Number input",
    valueFormatter: ({
      data
    }) => {
      const v = data?.distance;
      return v != null ? \`\${v}m\` : "–";
    }
  })], []);
  const addRowAction = useCallback(async () => {
    await wait(1000);
    const lastRow = rowData[rowData.length - 1];
    await selectRowsWithFlashDiff(async () => {
      setRowData([...rowData, {
        id: (lastRow?.id ?? 0) + 1,
        name: "?",
        nameType: "?",
        numba: "?",
        plan: "",
        distance: null
      }]);
    });
  }, [rowData, selectRowsWithFlashDiff]);
  return <>
      <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={"autoHeight"} defaultColDef={{
      minWidth: 70
    }} sizeColumns={"auto"} onCellEditingComplete={() => {
      /* eslint-disable-next-line no-console */
      console.log("Cell editing complete");
    }} contextMenu={ContextMenu} />
      <ActionButton icon={"ic_add"} name={"Add new row"} inProgressName={"Adding..."} onClick={addRowAction} />
    </>;
}`,...s.parameters?.docs?.source}}};const _=["_EditContextMenu"];export{s as _EditContextMenu,_ as __namedExportsOrder,k as default};
