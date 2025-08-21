import{j as l,L as E,a as I,f as k,c as D}from"./util-B6pJytQ4.js";/* empty css                  */import{G,a as R}from"./GridUpdatingContextProvider-R8BvGmQD.js";import"./stateDeferredHook-Dvy6TW6N.js";import{r as c}from"./iframe-BBeBoPQM.js";import{G as w}from"./GridWrapper-C94wn5Fr.js";import{c as P,G as x}from"./Grid-CbECBfpJ.js";import"./ActionButton-oJCgpU9B.js";import{w as S}from"./storybookTestUtil-D13wlVSp.js";import"./index-Ci9P-iYA.js";import"./preload-helper-Ct5FWWRu.js";const v=e=>{const{data:t,node:i,column:o,colDef:a,api:n}=e,r=c.useRef(null);return c.useEffect(()=>{const s=d=>{d.rowIndex===i.rowIndex&&d.column===o&&r.current?.focus()};return n.addEventListener("cellFocused",s),()=>{n.removeEventListener("cellFocused",s)}},[n,o,i.rowIndex]),l.jsx(E,{ref:r,className:"lui-button-icon-only",size:"sm",level:"text",onClick:()=>{const s=[t],d=s.map(p=>p.id);a?.cellEditorParams.onClick?.({selectedRows:s,selectedRowIds:d})},style:{display:a?.cellEditorParams?.visible?.(e)!==!1?"":"none"},children:l.jsx(I,{name:"ic_redo",alt:"revert",size:"md"})})},y=(e,t)=>w({minWidth:72,maxWidth:72,resizable:!1,headerClass:"GridHeaderAlignCenter",cellClass:"GridCellAlignCenter",cellRenderer:v,cellEditorParams:{...t},...e}),g=e=>{const{onValueChange:t,value:i,api:o,node:a,column:n,colDef:r,data:s}=e,d=c.useRef(null);c.useEffect(()=>{const f=u=>{u.rowIndex===a.rowIndex&&u.column===n&&d.current?.focus()};return o.addEventListener("cellFocused",f),()=>{o.removeEventListener("cellFocused",f)}},[o,n,a.rowIndex]);const p=!k(r?.editable,e);return l.jsx("div",{className:D("ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper",{"ag-checked":e.value,"ag-disabled":p}),children:l.jsx("input",{type:"checkbox",className:"ag-input-field-input ag-checkbox-input",disabled:p,ref:d,checked:i,onChange:()=>{},onClick:f=>{if(f.stopPropagation(),!t)return;const u=e?.colDef?.cellEditorParams;if(!u)return;const C=[];o.forEachNode(h=>{h.data.id===s.id&&C.push(h.data)});const b=!i;t(b),u.onClick({selectedRows:C,selectedRowIds:C.map(h=>h.id),checked:b})}})})},B=(e,t)=>w({minWidth:64,maxWidth:64,cellRenderer:g,cellEditor:g,cellEditorParams:t,onCellClicked:P,singleClickEdit:!0,resizable:!1,editable:!0,cellClass:"GridCellAlignCenter",headerClass:"GridHeaderAlignCenter",...e}),O={title:"Components / Grids",component:x,decorators:[e=>l.jsx("div",{style:{width:1024,height:400},children:l.jsx(G,{children:l.jsx(R,{children:l.jsx(e,{})})})})]},j=()=>{const[e,t]=c.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",bold:!0},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",bold:!1}]),i=c.useMemo(()=>[w({field:"id",headerName:"Id"}),y({colId:"button",headerName:"Button"},{visible:({data:o})=>!!(o.id&1),onClick:({selectedRowIds:o})=>{alert("click "+String(o))}}),B({field:"bold"},{onClick:({selectedRowIds:o,checked:a})=>(t(n=>(console.log("onchange",o,a),n.map(r=>o.includes(r.id)?{...r,bold:a}:r))),!0)})],[]);return l.jsx(x,{columnDefs:i,rowData:e,selectable:!1,singleClickEdit:!0,rowSelection:"single",domLayout:"autoHeight"})},m=j.bind({});m.play=S;m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};const X=["_EditBoolean"];export{m as _EditBoolean,X as __namedExportsOrder,O as default};
