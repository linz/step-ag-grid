import{j as l,a as E,b as I,f as k,c as D}from"./util-ijFjlinu.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Du3IBcJj.js";import{r as c}from"./iframe-DlkmCGKI.js";import{G as w}from"./GridWrapper-BPNz-Kwc.js";import{c as G,G as x}from"./Grid-x2Pv4IEw.js";import"./client-iOTQfKt-.js";import{G as R,a as P}from"./GridUpdatingContextProvider-BzZAfXqp.js";import"./ActionButton-Ch-xL9UL.js";import{w as S}from"./storybookTestUtil-D13wlVSp.js";import"./index-cvdpWsZ8.js";import"./preload-helper-PPVm8Dsz.js";const v=e=>{const{data:t,node:i,column:o,colDef:r,api:a}=e,n=c.useRef(null);return c.useEffect(()=>{const s=d=>{d.rowIndex===i.rowIndex&&d.column===o&&n.current?.focus()};return a.addEventListener("cellFocused",s),()=>{a.removeEventListener("cellFocused",s)}},[a,o,i.rowIndex]),l.jsx(E,{ref:n,className:"lui-button-icon-only",size:"sm",level:"text",onClick:()=>{const s=[t],d=s.map(p=>p.id);r?.cellEditorParams.onClick?.({selectedRows:s,selectedRowIds:d})},style:{display:r?.cellEditorParams?.visible?.(e)!==!1?"":"none"},children:l.jsx(I,{name:"ic_redo",alt:"revert",size:"md"})})},y=(e,t)=>w({minWidth:72,maxWidth:72,resizable:!1,headerClass:"GridHeaderAlignCenter",cellClass:"GridCellAlignCenter",cellRenderer:v,cellEditorParams:{...t},...e}),g=e=>{const{onValueChange:t,value:i,api:o,node:r,column:a,colDef:n,data:s}=e,d=c.useRef(null);c.useEffect(()=>{const f=u=>{u.rowIndex===r.rowIndex&&u.column===a&&d.current?.focus()};return o.addEventListener("cellFocused",f),()=>{o.removeEventListener("cellFocused",f)}},[o,a,r.rowIndex]);const p=!k(n?.editable,e);return l.jsx("div",{className:D("ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper",{"ag-checked":e.value,"ag-disabled":p}),children:l.jsx("input",{type:"checkbox",className:"ag-input-field-input ag-checkbox-input",disabled:p,ref:d,checked:i,onChange:()=>{},onClick:f=>{if(f.stopPropagation(),!t)return;const u=e?.colDef?.cellEditorParams;if(!u)return;const C=[];o.forEachNode(h=>{h.data.id===s.id&&C.push(h.data)});const b=!i;t(b),u.onClick({selectedRows:C,selectedRowIds:C.map(h=>h.id),checked:b})}})})},B=(e,t)=>w({minWidth:64,maxWidth:64,cellRenderer:g,cellEditor:g,cellEditorParams:t,onCellClicked:G,singleClickEdit:!0,resizable:!1,editable:!0,cellClass:"GridCellAlignCenter",headerClass:"GridHeaderAlignCenter",...e}),U={title:"Components / Grids",component:x,decorators:[e=>l.jsx("div",{style:{width:1024,height:400},children:l.jsx(R,{children:l.jsx(P,{children:l.jsx(e,{})})})})]},j=()=>{const[e,t]=c.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",bold:!0},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",bold:!1}]),i=c.useMemo(()=>[w({field:"id",headerName:"Id"}),y({colId:"button",headerName:"Button"},{visible:({data:o})=>!!(o.id&1),onClick:({selectedRowIds:o})=>{alert("click "+String(o))}}),B({field:"bold"},{onClick:({selectedRowIds:o,checked:r})=>(t(a=>(console.log("onchange",o,r),a.map(n=>o.includes(n.id)?{...n,bold:r}:n))),!0)})],[]);return l.jsx(x,{columnDefs:i,rowData:e,selectable:!1,singleClickEdit:!0,rowSelection:"single",domLayout:"autoHeight"})},m=j.bind({});m.play=S;m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const [rowData, setRowData] = useState([{
    id: 1000,
    name: 'IS IS DP12345',
    nameType: 'IS',
    numba: 'IX',
    plan: 'DP 12345',
    bold: true
  }, {
    id: 1001,
    name: 'PEG V SD523',
    nameType: 'PEG',
    numba: 'V',
    plan: 'SD 523',
    bold: false
  }] as IFormTestRow[]);
  const columnDefs: ColDefT<IFormTestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridButton({
    colId: 'button',
    headerName: 'Button'
  }, {
    visible: ({
      data
    }) => !!(data.id & 1),
    onClick: ({
      selectedRowIds
    }) => {
      alert('click ' + String(selectedRowIds));
    }
  }), GridEditBoolean({
    field: 'bold'
  }, {
    onClick: ({
      selectedRowIds,
      checked
    }) => {
      setRowData(rowData => {
        // eslint-disable-next-line no-console
        console.log('onchange', selectedRowIds, checked);
        return rowData.map(row => selectedRowIds.includes(row.id) ? {
          ...row,
          bold: checked
        } : row);
      });
      return true;
    }
  })], []);
  return <Grid columnDefs={columnDefs} rowData={rowData} selectable={false} singleClickEdit={true} rowSelection="single" domLayout={'autoHeight'} />;
}`,...m.parameters?.docs?.source}}};const q=["_EditBoolean"];export{m as _EditBoolean,q as __namedExportsOrder,U as default};
