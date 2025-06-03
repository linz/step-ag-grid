import{j as l}from"./index-uvRZkhe0.js";/* empty css                  */import{G as E,a as I}from"./GridUpdatingContextProvider-TUzqEau3.js";import"./stateDeferredHook-Dh_hbzWK.js";import{r as c}from"./index-DQDNmYQF.js";import{G as w}from"./GridWrapper-nASS91gz.js";import{f as k,G as x}from"./Grid-Gw6JH53N.js";import{L as D,b as G,f as R,c as P}from"./util-FCHWxW_t.js";import"./ActionButton-C0tjKgIQ.js";import{w as S}from"./storybookTestUtil-DBFt3sMW.js";import"./index-DYVtDik4.js";import"./index-BFcdsecu.js";const v=e=>{const{data:t,node:i,column:o,colDef:r,api:n}=e,a=c.useRef(null);return c.useEffect(()=>{const s=d=>{d.rowIndex===i.rowIndex&&d.column===o&&a.current?.focus()};return n.addEventListener("cellFocused",s),()=>{n.removeEventListener("cellFocused",s)}},[n,o,i.rowIndex]),l.jsx(D,{ref:a,className:"lui-button-icon-only",size:"sm",level:"text",onClick:()=>{const s=[t],d=s.map(p=>p.id);r?.cellEditorParams.onClick?.({selectedRows:s,selectedRowIds:d})},style:{display:r?.cellEditorParams?.visible?.(e)!==!1?"":"none"},children:l.jsx(G,{name:"ic_redo",alt:"revert",size:"md"})})},y=(e,t)=>w({minWidth:72,maxWidth:72,resizable:!1,headerClass:"GridHeaderAlignCenter",cellClass:"GridCellAlignCenter",cellRenderer:v,cellEditorParams:{...t},...e}),g=e=>{const{onValueChange:t,value:i,api:o,node:r,column:n,colDef:a,data:s}=e,d=c.useRef(null);c.useEffect(()=>{const f=u=>{u.rowIndex===r.rowIndex&&u.column===n&&d.current?.focus()};return o.addEventListener("cellFocused",f),()=>{o.removeEventListener("cellFocused",f)}},[o,n,r.rowIndex]);const p=!R(a?.editable,e);return l.jsx("div",{className:P("ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper",{"ag-checked":e.value,"ag-disabled":p}),children:l.jsx("input",{type:"checkbox",className:"ag-input-field-input ag-checkbox-input",disabled:p,ref:d,checked:i,onChange:()=>{},onClick:f=>{if(f.stopPropagation(),!t)return;const u=e?.colDef?.cellEditorParams;if(!u)return;const C=[];o.forEachNode(h=>{h.data.id===s.id&&C.push(h.data)});const b=!i;t(b),u.onClick({selectedRows:C,selectedRowIds:C.map(h=>h.id),checked:b})}})})},B=(e,t)=>w({minWidth:64,maxWidth:64,cellRenderer:g,cellEditor:g,cellEditorParams:t,onCellClicked:k,singleClickEdit:!0,resizable:!1,editable:!0,cellClass:"GridCellAlignCenter",headerClass:"GridHeaderAlignCenter",...e}),X={title:"Components / Grids",component:x,decorators:[e=>l.jsx("div",{style:{width:1024,height:400},children:l.jsx(E,{children:l.jsx(I,{children:l.jsx(e,{})})})})]},j=()=>{const[e,t]=c.useState([{id:1e3,name:"IS IS DP12345",nameType:"IS",numba:"IX",plan:"DP 12345",bold:!0},{id:1001,name:"PEG V SD523",nameType:"PEG",numba:"V",plan:"SD 523",bold:!1}]),i=c.useMemo(()=>[w({field:"id",headerName:"Id"}),y({colId:"button",headerName:"Button"},{visible:({data:o})=>!!(o.id&1),onClick:({selectedRowIds:o})=>{alert("click "+String(o))}}),B({field:"bold"},{onClick:({selectedRowIds:o,checked:r})=>(t(n=>(console.log("onchange",o,r),n.map(a=>o.includes(a.id)?{...a,bold:r}:a))),!0)})],[]);return l.jsx(x,{columnDefs:i,rowData:e,selectable:!1,singleClickEdit:!0,rowSelection:"single",domLayout:"autoHeight"})},m=j.bind({});m.play=S;m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};const U=["_EditBoolean"];export{m as _EditBoolean,U as __namedExportsOrder,X as default};
